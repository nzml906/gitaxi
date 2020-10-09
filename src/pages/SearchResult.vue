<template>
  <div class="grid__row">
    <user-list
      :user-showing="keyword"
      :list-user="listResult"
      list-title="Search result for keyword"
    >
    </user-list>
  </div>
</template>

<script>
import UserList from '@/components/UserList.vue';
export default {
  name: 'searchResult',
  components: { UserList },
  computed: {
    keyword() {
      return this.$route.query.q;
    },
    userSearchResult() {
      return this.$store.getters.userSearchResult;
    },
    listResult() {
      let res = [];
      if (this.userSearchResult && this.userSearchResult.items.length > 0) {
        res = this.userSearchResult.items;
      }
      return res;
    }
  },
  activated() {
    this.$store.dispatch('searchUser', this.keyword);
  }
};
</script>
