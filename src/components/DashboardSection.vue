<template>
  <div class="dashboard-section">
    <div class="dashboard-section-title-container">
      <h4 v-if="lecture_type === 'Live'" class="dashboard-section-title"> Synchronous</h4>
      <h4 v-else-if="lecture_type === 'Playback'" class="dashboard-section-title">Asynchronous</h4>
      <h4 v-else class="dashboard-section-title">{{ lecture_type }}</h4>
    </div>
    <div class="dashboard-section-body-container">
      <LectureList :lecture_type="lecture_type" :lecture_list="lecture_list" />
    </div>
  </div>
</template>

<script>
  import LectureList from '@/components/LectureList'

  export default {
    name: 'DashboardSection',
    props: {
      lecture_type: String,
      lecture_list: Array
    },
    computed: {
    },
    components: {
      LectureList
    },
    data(){
      return {
      }
    },
    methods: {

    }
  }
</script>

<style scoped>
:root {
  --dashboard-background-color: #f5f5f5;
  --dashboard-text-color: #2c3e50;
  --background-color: white;
}
.dashboard-section {
  width: 50%;
  display: inline-block;
  vertical-align: top;
  margin-top: 1rem;
  background: var(--main-background-color);
  color: var(--main-text-color); 
}

.dashboard-section-title-container {
  height: 4rem;
  text-align: left;
  padding-left: 2rem;
  padding-top: 1rem;
}

.dashboard-section-title {
  color: var(--dashboard-text-color);
  font-weight: bold;
}

.dashboard-section-body-container {
  min-height: 10rem;
  max-height: 13rem;
  overflow-y: auto;
}

.dashboard-section-body-container::-webkit-scrollbar {
  width: 12px;
}

.dashboard-section-body-container::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: var(--dashboard-background-color);
}

/*Ipad & below*/
@media only screen and (max-width: 800px) {
  .dashboard-section {
    width: 100%;
    /*margin-top: 4rem;*/
  }

  .dashboard-section-title-container {
    text-align: center;
    padding: 0;
  }

  .dashboard-section-body-container {
    min-height: 4rem;
  }
}
</style>
