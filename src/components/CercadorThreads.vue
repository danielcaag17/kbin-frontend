<template>
  <BarraBase v-model:actiu="actiu">
    <div id="middle" class="page-search page-settings">
      <div class="kbin-container">
        <main id="main" data-controller="lightbox timeago" class="view-compact">
          <div class="section section--top">
            <div class="container">
              <form @submit.prevent="Cercador(key)">
                <div class="flex" style="align-items: center">
                  <input v-model="key" name="keyword" type="text" class="form-control"
                         placeholder="Type search term" autofocus="">
                  <button class="btn btn__primary" type="button" @click="Cercador(key)" aria-label="Search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
          <template v-if="keyword !== '' && keyword !== null && Carregat">
            <aside class="options options--top" id="options">
              <div></div>
              <menu class="options__main no-scroll">
                <li><a :class="{ active: activeOption === 'top' }" :href="'/cercador/top/' + activeFilter + '/' + (keyword !== '' ? '?keyword=' + keyword : '')">Top</a></li>
                <li><a :class="{ active: activeOption === 'newest' }" :href="'/cercador/newest/' + activeFilter + '/' + (keyword !== '' ? '?keyword=' + keyword : '')">Newest</a></li>
                <li><a :class="{ active: activeOption === 'commented' }" :href="'/cercador/commented/' + activeFilter + '/' + (keyword !== '' ? '?keyword=' + keyword : '')">Commented</a></li>
              </menu>
              <menu class="options__filters">
                <li class="dropdown">
                  <button aria-label="Filtrar per tipus" title="Filtrar per tipus">
                    <i class="fa-solid fa-filter"></i>Filter by type
                  </button>
                  <ul class="dropdown__menu">
                    <li><a :class="{ active: activeFilter === 'tot'}"
                           :href="'/cercador/' + activeOption + '/tot/' + (keyword !== '' ? '?keyword=' + keyword : '')" >Tot</a></li>
                    <li>
                      <a :class="{ active: activeFilter === 'links'}"
                          :href="'/cercador/' + activeOption + '/links/' + (keyword !== '' ? '?keyword=' + keyword : '')">Links</a>
                    </li>
                    <li>
                      <a :class="{ active: activeFilter === 'threads'}"
                          :href="'/cercador/' + activeOption + '/threads/' + (keyword !== '' ? '?keyword=' + keyword : '')">Threads</a>
                    </li>
                  </ul>
                </li>
              </menu>
            </aside>
            <div v-if="threads === null || threads.length === 0" id="content" class="overview subjects comments-tree comments show-post-avatar">
              <aside class="section section--muted">
                <p>Empty</p>
              </aside>
            </div>
            <div v-else id="content">
              <ShowThreads v-for="thread in threads" :key="thread.id" :thread="thread"/>
            </div>

          </template>
        </main>
      </div>
    </div>
  </BarraBase>
</template>

<script>
import BarraBase from '@/components/BarraBase.vue';
import ShowThreads from '@/components/ShowThreads.vue';
import axios from 'axios';

export default {
  name: 'CercadorThreads',
  components: {
    ShowThreads,
    BarraBase,
  },
  data() {
    return {
      actiu: '',
      activeOption: 'newest',  // Valor inicial predeterminado
      activeFilter: 'tot',      // Valor inicial predeterminado
      keyword: null,
      threads: null,
      Carregat: false,
      api: 'https://bravo13-36a68ba47d34.herokuapp.com/api',
    }
  },
  async   mounted() {
    const {activeFilter, activeOption} = this.$route.params;
    const params = new URLSearchParams(window.location.search);
    // const activeFilterParam = params.get('activeFilter');
    const keyword = params.get('keyword');
    if (activeFilter) {
      this.activeFilter = activeFilter;
    }
    if (activeOption) {
      this.activeOption = activeOption;
    }
    if (keyword) {
      this.keyword = keyword;
    }
    await this.Cercador(this.keyword);
    this.Carregat = true;
  },
  watch: {},
  methods: {
    async Cercador(keyword) {
      if (keyword === null) return;
      // console.log(this.activeFilter);
      // console.log(keyword);
      const check = keyword.trim();
      if (check === '') {
        this.keyword = keyword.trim();
        window.location.reload();
      } else {
        this.keyword = keyword;
        if (this.activeFilter === 'tot') {
          const response = await axios.get(
              `${this.api}/cercador/publicacions/${this.activeOption}/`,
              {
                headers: {
                  keyword: keyword
                }
              });
          this.threads = response.data;

        } else if (this.activeFilter === 'threads') {
          const response = await axios.get(
              `${this.api}/cercador/threads/${this.activeOption}/`,
              {
                headers: {
                  keyword: keyword
                }
              });
          this.threads = response.data;
        } else if (this.activeFilter === 'links') {
          const response = await axios.get(
              `${this.api}/cercador/links/${this.activeOption}/`,
              {
                headers: {
                  keyword: keyword
                }
              });
          this.threads = response.data;
        }
        this.$router.push(`/cercador/${this.activeOption}/links/${this.keyword !== '' ? '?keyword=' + this.keyword : ''}`);
      }
    }
  }
}
</script>
