<template>
  <template v-if="totcarregat">
    <div id="middle" class="page-user page-user-overview">
      <div class="kbin-container">
        <main id="main" data-controller="lightbox timeago" class="view-compact">
          <div class="section section--top">
            <div class="user-box">
              <div>
                <div class="user-main" id="content">
                  <div style="margin-right: 200px;">
                    <div class="row">
                      <h1>{{ magazine.title }}</h1>
                      <small>{{ magazine.name }}@kbin.social</small>
                    </div>
                    <aside class="user__actions" data-controller="subs">
                      <div class="action">
                        <i class="fa-solid fa-users"></i>
                        <span>{{ magazine.n_suscriptions }}</span>
                      </div>
                      <div>
                        Created: {{ formatejarData(magazine.creation_date) }}
                        <br>
                        <div style="display: block;">
                          Owner: <a :href="`/u/${this.magazine.author}/`">{{ magazine.author }}</a>
                        </div>
                      </div>
                    </aside>
                  </div>
                  <div>
                    <div>
                      <strong>Description</strong>
                      <br>
                      {{ magazine.description }}
                    </div>
                    <br>
                    <div>
                      <strong>Rules</strong>
                      <br>
                      {{ magazine.rules }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <aside id="options" class="options options--top">
            <menu class="options__main no-scroll">
              <li><a :class="{ 'active': activeOption === 'top' }"
                     :href="`/magazine/${magazine.id}/top/` + activeFilter">Top</a></li>
              <li><a :class="{ 'active': activeOption === 'newest' }"
                     :href="`/magazine/${magazine.id}/newest/` + activeFilter">Newest</a></li>
              <li><a :class="{ 'active': activeOption === 'commented' }"
                     :href="`/magazine/${magazine.id}/commented/` + activeFilter">Commented</a></li>
            </menu>
            <menu class="options__filters">
              <li class="dropdown">
                <button aria-label="Filtrar per tipus" title="Filtrar per tipus">
                  <i class="fa-solid fa-filter"></i> Filter by type
                </button>
                <ul class="dropdown__menu">
                  <li><a :class="{ 'active': activeFilter === 'tot' }"
                         :href="`/magazine/${magazine.id}/` + activeOption + '/tot'">Tot</a></li>
                  <li><a :class="{ 'active': activeFilter === 'links' }"
                         :href="`/magazine/${magazine.id}/` + activeOption + '/links'">Links</a></li>
                  <li><a :class="{ 'active': activeFilter === 'threads' }"
                         :href="`/magazine/${magazine.id}/` + activeOption + '/threads'">Threads</a></li>
                </ul>
              </li>
            </menu>
          </aside>
          <div v-if="threads === null || threads.length === 0" id="content"
               class="overview subjects comments-tree comments show-post-avatar">
            <aside class="section section--muted">
              <p>Empty</p>
            </aside>
          </div>
          <div v-else id="content">
            <ShowThreads v-for="thread in threads" :key="thread.id" :thread="thread"/>
          </div>
        </main>
      </div>
    </div>
  </template>
</template>

<script>
import ShowThreads from "@/components/ShowThreads.vue";
import axios from "axios";

export default {
  components: {ShowThreads},
  props: {
    magazine: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      activeFilter: "tot",
      activeOption: "top",
      api: 'https://bravo13-36a68ba47d34.herokuapp.com/api',
      threads: null,
      totcarregat: false
    }
  },
  async mounted() {
    const {activeOption, activeFilter} = this.$route.params;
    if (activeOption) {
      this.activeOption = activeOption;
    }
    if (activeFilter) {
      this.activeFilter = activeFilter;
    }
    await this.fetchThreads();
    this.totcarregat = true;
  },
  methods: {
    async fetchThreads() {
      try {
        if (this.activeFilter === 'tot') {
          const response = await axios.get(`${this.api}/magazine/${this.magazine.id}/publicacions/${this.activeOption}/`);
          this.threads = response.data;
        } else {
          const response = await axios.get(`${this.api}/magazine/${this.magazine.id}/${this.activeFilter}/${this.activeOption}/`);
          this.threads = response.data;
        }
      } catch (error) {
        console.error('Error fetching threads:', error);
      }
    },
    formatejarData(inputDate) {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const date = new Date(inputDate);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hour = date.getHours();
    const minute = date.getMinutes();
    const period = (hour >= 12) ? "p.m." : "a.m.";

    if (hour > 12) {
        hour -= 12;
    }

    return `${month} ${day}, ${year}, ${hour}:${minute < 10 ? '0' + minute : minute} ${period}`;
}

  },
}
</script>