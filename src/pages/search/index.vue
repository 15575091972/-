<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            //分类面包屑
            <li class="with-x" v-if="searchParmams.categoryName">
              {{ searchParmams.categoryName
              }}<i @click="removCategoryName">×</i>
            </li>
            //关键字面包屑
            <li class="with-x" v-if="searchParmams.keyword">
              {{ searchParmams.keyword }}<i @click="removCategoryKeyword">×</i>
            </li>
            //品牌面包屑
            <li class="with-x" v-if="searchParmams.trademark">
              {{ searchParmams.trademark.split(":")[1]
              }}<i @click="removetrademark">×</i>
            </li>

            //售卖属性面包屑
            <li
              class="with-x"
              v-for="(attrValue, index) in searchParmams.props"
              :key="index"
            >
              {{ attrValue.split(":")[1] }}<i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trademarkinf="trademarkinf" @attrInfo="attrInfo" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="sort(1)">
                  <a
                    >综合
                    <span
                      v-show="isOne"
                      class="iconfont"
                      :class="{ 'icon-DOWN': isDesc, 'icon-UP': isAsc }"
                    ></span
                  ></a>
                </li>
                <li :class="{ active: isTwo }" @click="sort(2)">
                  <a
                    >价格
                    <span
                      v-show="isTwo"
                      class="iconfont"
                      :class="{ 'icon-DOWN': isDesc, 'icon-UP': isAsc }"
                    ></span
                  ></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li
                class="yui3-u-1-5"
                v-for="(good, index) in goodsList"
                :key="good.id"
              >
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`"
                      ><img :src="good.defaultImg"
                    /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ good.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <Pagination
      :total="total"
      :pageSize="searchParmams.pageSize"
      :pageNo="searchParmams.pageNo"
      :pagerCount="5"
      @currentPage="currentPage"
    ></Pagination>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
import { mapState } from "vuex";
import router from "@/router";
import Pagination from "../../components/Pagination/index.vue";
export default {
  name: "Search",

  components: {
    SearchSelector,
    Pagination,
  },

  data() {
    return {
      searchParmams: {
        category1id: "",
        category2id: "",
        category3id: "",
        categoryName: "",
        keyword: "",
        order: "",
        pageNo: 1,
        pageSize: 10,
        props: [],
        //品牌
        trademark: "",

        //排序
        order: "1:desc",
      },
    };
  },

  created() {},
  beforeMount() {
    //在发送请求之前，合并参数
    Object.assign(this.searchParmams, this.$route.query, this.$route.params);
  },
  mounted() {
    this.getDate();
  },
  computed: {
    ...mapState({
      goodsList: (state) => state.search.searchlist.goodsList,
      //真实数据条数
      total: (state) => state.search.searchlist.total,
    }),
    //计算属性，简化
    isOne() {
      return this.searchParmams.order.indexOf("1") != -1;
    },
    isTwo() {
      return this.searchParmams.order.indexOf("2") != -1;
    },

    isDesc() {
      return this.searchParmams.order.indexOf("desc") != -1;
    },
    isAsc() {
      return this.searchParmams.order.indexOf("asc") != -1;
    },
  },
  //数据监听,监听路由信息,如果变化，则重新发送请求
  watch: {
    $route(newValue, oldValue) {
      // console.log(this.searchParmams),
      Object.assign(this.searchParmams, this.$route.query, this.$route.params);
      this.getDate();
      //清除上一次id
      this.searchParmams.category1id = "";
      this.searchParmams.category2id = "";
      this.searchParmams.category3id = "";
    },
  },

  methods: {
    getDate() {
      this.$store.dispatch("getSearchList", this.searchParmams);
    },

    removCategoryName() {
      //参数置空，重新发送请求
      //undefined 不会发送给服务器
      this.searchParmams.category1id = undefined;
      this.searchParmams.category2id = undefined;
      this.searchParmams.category3id = undefined;
      this.searchParmams.categoryName = undefined;
      // this.searchParmams.keyword = "";
      this.getDate();
      //删除query参数，带上params参数
      if (this.$route.params) {
        this.$router.push({ name: "search", params: this.$route.params });
      }
    },
    //删除关键字
    removCategoryKeyword() {
      this.searchParmams.keyword = undefined;
      this.getDate();
      //通知兄弟组件删除关键字
      this.$bus.$emit("clear");
      //路由跳转
      if (this.$route.query) {
        this.$router.push({ name: "search", query: this.$route.query });
      }
    },

    //删除品牌信息,发送新请求
    removetrademark() {
      this.searchParmams.trademark = undefined;
      this.getDate();
    },
    //删除售卖属性
    removeAttr(index) {
      this.searchParmams.props.splice(index, 1);
      this.getDate();
    },
    //自定义事件回调触发
    trademarkinf(trademark) {
      this.searchParmams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      // console.log(this.searchParmams.trademark)
      this.getDate();
    },
    //自定义事件回调函数，获取第几页数据
    currentPage(pageNo) {
      this.searchParmams.pageNo = pageNo;
      this.getDate();
      console.log(pageNo);
    },
    //接受售卖属性的回调
    attrInfo(attr, attrValue) {
      // console.log(attr,attrvalue)
      let props = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      //数组去重

      if (this.searchParmams.props.indexOf(props) == -1) {
        this.searchParmams.props.push(props);
        this.getDate();
      }
    },

    sort(flag) {
      //获取每一次order初始值,与用户点击传递进来的flag进行判断
      let originFlag = this.searchParmams.order.split(":")[0];
      let originSortType = this.searchParmams.order.split(":")[1];
      //准备一个新的数值，将来赋值给order
      let newOrder = "";
      //高亮的判断
      if (flag == originFlag) {
        newOrder = `${originFlag}:${originSortType == "desc" ? "asc" : "desc"}`;
      } else {
        //不是高亮的按钮
        newOrder = `${flag}:desc`;
      }
      //重新给order赋予新的数值
      this.searchParmams.order = newOrder;
      //重新发一次请求
      this.getDate();
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>