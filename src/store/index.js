import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';
import { getCache, saveCache } from '@/cache';

const base_path = 'https://api.github.com/';
const CACHEKEY_USERSEARCH = 'USER_SEARCH_';
const CACHEKEY_USERDATA = 'USER_DATA_';
const CACHEKEY_USERREPO = 'USER_REPO_';
const CACHEKEY_USERFOLLOWER = 'USER_FOLLOWER_';
const CACHEKEY_USERFOLLOWING = 'USER_FOLLOWING_';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isShowSidebar: false,
    loading: false,
    userSearchResult: null,
    bookmarkUser: 'mazipan',
    userData: {
      login: 'mazipan',
      id: 7221389,
      avatar_url: 'https://avatars0.githubusercontent.com/u/7221389?v=4',
      gravatar_id: '',
      followers_url: 'https://api.github.com/users/mazipan/followers',
      following_url:
        'https://api.github.com/users/mazipan/following{/other_user}',
      name: 'Irfan Maulana',
      bio: 'JS & CSS Coder',
      public_repos: 67,
      followers: 209,
      following: 146
    },
    userRepositories: [
      {
        id: 85024408,
        stargazers_count: 1,
        name: 'angular-indonesia-blogs',
        html_url: 'https://github.com/mazipan/angular-indonesia-blogs'
      },
      {
        id: 85024771,
        stargazers_count: 1,
        name: 'angular-indonesia-homepage',
        html_url: 'https://github.com/mazipan/angular-indonesia-homepage'
      },
      {
        id: 84786946,
        stargazers_count: 6,
        name: 'angularjs-basic-tutorial',
        html_url: 'https://github.com/mazipan/angularjs-basic-tutorial'
      },
      {
        id: 71746668,
        stargazers_count: 3,
        name: 'awesome-bemcss',
        html_url: 'https://github.com/mazipan/awesome-bemcss'
      },
      {
        id: 106997826,
        stargazers_count: 2,
        name: 'awesome-vue-list',
        html_url: 'https://github.com/mazipan/awesome-vue-list'
      }
    ],
    userFollowers: null,
    userFollowing: null,

    userActionTab: {
      login: 'mazipan',
      repos: 67,
      follower: 200,
      following: 146,
      isOrg: false,
      hideHome: false
    }
  },
  getters: {
    isShowSidebar: state => {
      return state.isShowSidebar;
    },
    isLoading: state => {
      return state.loading;
    },
    userSearchResult: state => {
      return state.userSearchResult;
    },
    userData: state => {
      return state.userData;
    },
    isBookmarkUser: state => {
      if (state.userData) {
        return state.bookmarkUser === state.userData.login;
      }
      return false;
    },
    bookmarkUser: state => {
      return state.bookmarkUser;
    },

    userRepositories: state => {
      return state.userRepositories;
    },
    userFollowers: state => {
      return state.userFollowers;
    },
    userFollowing: state => {
      return state.userFollowing;
    },

    userActionTab: state => {
      return state.userActionTab;
    }
  },
  mutations: {
    setShowSidebar(state, value) {
      state.isShowSidebar = value;
    },
    setLoading(state, value) {
      state.loading = value;
    },
    setUserSearchResult(state, value) {
      state.userSearchResult = value;
    },
    setUserData(state, value) {
      state.userData = value;
    },
    setBookmarkUser: (state, value) => {
      state.bookmarkUser = value;
      localStorage.setItem('bookmarked-user', value);
    },

    setUserRepositories(state, value) {
      state.userRepositories = value;
    },
    setUserFollowers(state, value) {
      state.userFollowers = value;
    },
    setUserFollowing(state, value) {
      state.userFollowing = value;
    },

    setUserActionTab(state, value) {
      state.userActionTab = value;
    }
  },
  actions: {
    readBookmarkUser({ commit }) {
      let user = localStorage.getItem('bookmarked-user');
      if (user) {
        commit('setBookmarkUser', user);
      } else {
        localStorage.setItem('bookmarked-user', this.bookmarkUser);
      }
    },
    setUserActionTab({ commit }, data) {
      let userActionTab = {
        login: data.login,
        repos: data.public_repos,
        follower: data.followers,
        following: data.following,
        isOrg: data.type !== 'User',
        hideHome: this.bookmarkUser === data.login
      };
      commit('setUserActionTab', userActionTab);
    },
    searchUser({ commit }, keyword) {
      commit('setLoading', true);
      // show cache data
      let cache = getCache(`${CACHEKEY_USERSEARCH}${keyword}`);
      if (cache) {
        commit('setLoading', false);
        commit('setUserSearchResult', cache);
      }
      // get data via axios
      else {
        axios
          .get(`${base_path}search/users?q=${keyword}`)
          .then(function(response) {
            commit('setLoading', false);
            saveCache(`${CACHEKEY_USERSEARCH}${keyword}`, response.data);
            commit('setUserSearchResult', response.data);
          })
          .catch(() => {
            commit('setLoading', false);
          });
      }
    },
    getUserData({ commit, dispatch }, user) {
      commit('setLoading', true);
      let cache = getCache(`${CACHEKEY_USERDATA}${user}`);
      if (cache) {
        commit('setLoading', false);
        commit('setUserData', cache);
        dispatch('setUserActionTab', cache);
      } else {
        axios
          .get(`${base_path}users/${user}`)
          .then(function(response) {
            saveCache(`${CACHEKEY_USERDATA}${user}`, response.data);
            commit('setLoading', false);
            commit('setUserData', response.data);
            dispatch('setUserActionTab', response.data);
          })
          .catch(() => {
            commit('setLoading', false);
          });
      }
    },
    getUserRepositories({ commit }, user) {
      console.log('calling action getUserRepositories()');
      commit('setLoading', true);
      let cache = getCache(`${CACHEKEY_USERREPO}${user}`);
      if (cache) {
        commit('setLoading', false);
        cache = cache.sort(function(a, b) {
          let starA = a.stargazers_count;
          let starB = b.stargazers_count;
          return starB > starA ? 1 : starB < starA ? -1 : 0;
        });
        commit('setUserRepositories', cache);
      } else {
        axios
          .get(`${base_path}users/${user}/repos?per_page=100`)
          .then(function(response) {
            console.log('response ', response.data);
            commit('setLoading', false);
            saveCache(`${CACHEKEY_USERREPO}${user}`, response.data);
            let array = response.data;
            if (array) {
              array = array.sort(function(a, b) {
                let starA = a.stargazers_count;
                let starB = b.stargazers_count;
                return starB > starA ? 1 : starB < starA ? -1 : 0;
              });
            }
            commit('setUserRepositories', array);
          })
          .catch(function() {
            commit('setLoading', false);
          });
      }
    },
    getUserFollowers({ commit }, user) {
      console.log('calling action getUserFollowers()');
      commit('setLoading', true);
      let cache = getCache(`${CACHEKEY_USERFOLLOWER}${user}`);
      if (cache) {
        commit('setLoading', false);
        commit('setUserFollowers', cache);
      } else {
        axios
          .get(`${base_path}users/${user}/followers`)
          .then(function(response) {
            console.log('response ', response.data);
            commit('setLoading', false);
            saveCache(`${CACHEKEY_USERFOLLOWER}${user}`, response.data);
            commit('setUserFollowers', response.data);
          })
          .catch(function() {
            commit('setLoading', false);
          });
      }
    },
    getUserFollowing({ commit }, user) {
      console.log('calling action getUserFollowing()');
      commit('setLoading', true);
      let cache = getCache(`${CACHEKEY_USERFOLLOWING}${user}`);
      if (cache) {
        commit('setLoading', false);
        commit('setUserFollowing', cache);
      } else {
        axios
          .get(`${base_path}users/${user}/following`)
          .then(function(response) {
            console.log('response ', response.data);
            commit('setLoading', false);
            saveCache(`${CACHEKEY_USERFOLLOWING}${user}`, response.data);
            commit('setUserFollowing', response.data);
          })
          .catch(function() {
            commit('setLoading', false);
          });
      }
    }
  }
});
