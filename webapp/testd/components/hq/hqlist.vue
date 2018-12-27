<template>
  <section id="hqlist">
    <div class="container">
      <div class="hqmain">
        <div class="hqtop h30 lh28 fs14">
          <span class="sp1">交易产品（点差）</span>
          <span class="sp2">卖出价</span>
          <span class="sp3">买入价</span>
        </div>
        <zw30/>
        <ul class="hqlists">
          <li
            v-for="(item, index) in lists"
            :key="index"
            class="hqlist h40"
          >
            <nuxt-link to="/hqdetail">
              <span class="sp1">{{ item.title }}</span>
              <span class="sp2">{{ item.mc }}</span>
              <span class="sp3">{{ item.mr }}</span>
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import zw30 from '~/components/shared/zw30.vue'
export default {
  components: {
    zw30
  },
  computed: {
    lists() {
      return [
        {
          title: '伦敦金',
          mc: '1263.34',
          mr: '1263.94'
        },
        {
          title: '伦敦银',
          mc: '14.701',
          mr: '14.741'
        },
        {
          title: '离岸人民币黄金',
          mc: '280.40',
          mr: '280.59'
        },
        {
          title: '离岸人民币白银',
          mc: '3262',
          mr: '3272'
        },
        {
          title: '纽约期油',
          mc: '45.94',
          mr: '46.00'
        },
        {
          title: '伦敦金',
          mc: '1263.34',
          mr: '1263.94'
        },
        {
          title: '伦敦银',
          mc: '14.701',
          mr: '14.741'
        },
        {
          title: '离岸人民币黄金',
          mc: '280.40',
          mr: '280.59'
        },
        {
          title: '离岸人民币白银',
          mc: '3262',
          mr: '3272'
        },
        {
          title: '纽约期油',
          mc: '45.94',
          mr: '46.00'
        },
        {
          title: '伦敦金',
          mc: '1263.34',
          mr: '1263.94'
        },
        {
          title: '伦敦银',
          mc: '14.701',
          mr: '14.741'
        },
        {
          title: '离岸人民币黄金',
          mc: '280.40',
          mr: '280.59'
        },
        {
          title: '离岸人民币白银',
          mc: '3262',
          mr: '3272'
        },
        {
          title: '纽约期油',
          mc: '45.94',
          mr: '46.00'
        }
      ]
    }
  }
}
</script>

<style scoped>
#hqlist span {
  display: inline-block;
  color: #666;
}
.hqtop {
  position: fixed;
  top: 40px;
  left: 0;
  width: 100%;
  height: 30px;
  border-bottom: 1px solid #999;
  background-color: #efefef;
}
.hqtop .sp2,
.hqtop .sp3 {
  background: none;
}
.sp1 {
  width: 40%;
}
.sp2,
.sp3 {
  width: 26%;
  margin: 0 1%;
  padding: 2px 8px;
  border-radius: 2px;
  background-color: yellow;
}
.hqlist {
  padding: 8px 0;
  border-bottom: 1px solid #999;
}
</style>
