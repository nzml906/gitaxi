<template>
  <div class="profile">
    <img v-lazy="profileImg" class="profile__img" :alt="userData.name" />

    <a
      class="thropy"
      title="See Git Award"
      :href="'http://git-awards.com/users/search?login=' + userData.login"
      target="_blank"
      rel="noopener"
    >
      <img src="assets/git.png" height="30" width="30" alt="image" />
    </a>

    <div
      class="is-bookmarked"
      :class="{ 'is-bookmarked--yes': isBookmarked }"
      title="Bookmark User"
      @click="bookmarkUser"
    >
      <img src="assets/git.png" height="30" width="30" alt="image" />
    </div>

    <div class="profile__identity">
      <div class="profile__name">{{ userData.name }}</div>
      <small class="profile__login">{{ userData.login }}</small>
    </div>

    <div class="profile__bio">
      {{ userData.bio }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'userprofile',
  props: ['userData', 'isBookmarked'],

  computed: {
    profileImg: function() {
      let img = 'https://avatars0.githubusercontent.com/u/7221389?v=4&s=100';
      if (this.userData && this.userData.avatar_url) {
        img = `${this.userData.avatar_url}&s=100`;
      }
      return img;
    }
  },
  methods: {
    bookmarkUser: function() {
      if (!this.isBookmarked) {
        this.$store.commit('setBookmarkUser', this.userData.login);
      } else alert('User has been bookmarked');
    }
  }
};
</script>

<style lang="scss" scoped>
.profile {
  text-align: center;
  color: #282828;

  &__img {
    height: 100px;
    border-radius: 50%;
    border: 5px solid #0096d9;
  }

  &__identity,
  &__bio {
    margin-bottom: 10px;
  }

  &__name {
    font-size: 24px;
    margin: 10px 0 0px;
  }

  &__login {
    color: #a49c9c;
    font-size: 16px;
  }
}
.thropy {
  position: absolute;
  top: 70px;
  left: 10px;
  cursor: pointer;
  color: #0096d9;
  font-size: 50px;
}
.is-bookmarked {
  position: absolute;
  top: 70px;
  right: 10px;
  cursor: pointer;
  color: #282828;

  &--yes {
    color: #0096d9;
  }
}
</style>
