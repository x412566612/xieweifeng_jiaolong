<template>
    <div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText">
            </el-input>

            <el-tree
              class="filter-tree"
              :data="treeMenu"
              :props="defaultProps"
              @node-click="handleNodeClick"
              default-expand-all
              show-checkbox
              node-key="id"
              :filter-node-method="filterNode"
              @check="handleCheckChange"
              ref="tree">
            </el-tree>

         </div>
        </el-col>
        <el-col :span="16"><div class="grid-content bg-purple"></div></el-col>
      </el-row>


      <div>
        <el-dialog title="菜单管理"  width="50%" :visible.sync="dialogTableVisible">
          <el-tabs type="border-card">

            <el-tab-pane v-if="pmenuInfo.leval!=4">
              <span slot="label"><i class="el-icon-plus"></i>添加下级菜单 </span>
              <el-form :label-position="labelPosition" label-width="80px" :model="menuInfo">
                <el-form-item label="当前菜单Id">
                  <el-input v-model="pmenuInfo.id" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="当前菜单名称">
                  <el-input v-model="pmenuInfo.menuName" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="当前菜单等级">
                  <el-input v-model="pmenuInfo.leval" readonly="readonly"></el-input>
                </el-form-item>
                <hr>
                <el-form-item label="下级菜单名称">
                  <el-input v-model="menuInfo.menuName" ></el-input>
                </el-form-item>
                <el-form-item label="下级菜单路径">
                  <el-input v-model="menuInfo.url" ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="over()">取 消</el-button>
                  <el-button type="primary" @click="add()">保存</el-button>
                  <el-button @click="resetForm()">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>



            <el-tab-pane>
                <span slot="label"><i class="el-icon-edit"></i>修改当前菜单 </span>
              <el-form :label-position="labelPosition" label-width="80px" :model="pmenuInfo">
                <el-form-item label="当前菜单Id">
                  <el-input v-model="pmenuInfo.id" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="当前菜单名称">
                  <el-input v-model="pmenuInfo.menuName" ></el-input>
                </el-form-item>
                <el-form-item label="当前菜单路径">
                  <el-input v-model="pmenuInfo.url" ></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button @click="over()">取 消</el-button>
                  <el-button type="primary" @click="update()">保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>



            <el-tab-pane>
                <span slot="label"><i class="el-icon-delete"></i>
                  删除当前菜单
                </span>
              <el-button type="text" @click="open()">删除</el-button>

            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-folder-add"></i>添加一级菜单 </span>
              添加一级菜单
              <el-form :label-position="labelPosition" label-width="80px" :model="menuInfo">
                <el-form-item label="菜单名称">
                  <el-input v-model="menuInfo.menuName" ></el-input>
                </el-form-item>
                <el-form-item label="菜单路径">
                  <el-input v-model="menuInfo.url" ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="over()">取 消</el-button>
                  <el-button type="primary" @click="save()">保存</el-button>
                  <el-button @click="resetForm()">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-dialog>
      </div>
    </div>
</template>

<script>
    export default {
      name: "tmenu",
      data(){
          return{
            treeMenu:[],//tree树
            filterText: '',//用于过滤树
            pmenuInfo:{},//当前对象
            menuInfo:{},//用于提交的对象
            readonly:true,//是否只读
            dialogTableVisible:false,//控制模态框
            labelPosition:'left',//样式
            defaultProps: {
              children: 'menuInfoList',
              label: 'menuName'
            },
            map:{},
          }
      },
      watch: {//监控参数值是否变化
        filterText(val) {//变化后过滤
          this.$refs.tree.filter(val);
        }
      },
      mounted() {//预加载函数
        this.find();
      },
      methods: {
        save(){//添加一级菜单
          let  uri = this.domain.serverpath+"insertMenu";
          //由于添加一级菜单,后台不好赋初值,所以前台赋值
          this.menuInfo.leval = 1;
          this.menuInfo.parentId = 0;

          //添加
          this.$axios.post(uri,this.menuInfo).then(response=>{
            if(response.data.code ==200){
              alert(response.data.success);
              //成功后,清空参数,关闭模态框,然后重新查询参数
              this.pmenuInfo={};
              this.menuInfo={};
              this.dialogTableVisible = false;
              this.find();
              }else if(response.data.code ==500){
              alert(response.data.success);
            }
          }).catch(error=>{
            alert("没有权限");
          })
        },
        open() {
          //提示信息,确认是否删除
          if(confirm("此操作将永久删除该文件, 是否继续?")){
            this.map.id = this.pmenuInfo.id;
            this.del();
          }else{
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          }

        },
        del(){
          //删除,成功后关闭模态框,并重新查询
          this.$axios.post(this.domain.serverpath+"deleteMenu",this.map).then(response=>{
            if(response.data.code ==200){
              alert(response.data.success);
              this.over();
              this.find(1);
            }else if(response.data.code ==500){
              alert(response.data.success);
            }
          }).catch(error=>{
            alert("没有权限");
          })
        },
        update(){
          //修改
          let  uri = this.domain.serverpath+"updateMenu";
          this.$axios.post(uri,this.pmenuInfo).then(response=>{
            //修改成功后清空并关闭模态框
            if(response.data.code ==200){
              alert(response.data.success);
              this.pmenuInfo={};
              this.menuInfo={};
              this.dialogTableVisible = false;
              this.find();
            }else if(response.data.code ==500){
              alert(response.data.success);
            }
          }).catch(error=>{
            alert("没有权限");
          })
        },
        add(){
          //添加下级菜单
          let  uri = this.domain.serverpath+"insertMenu";
          //在当前菜单的等级上+1
          this.menuInfo.leval = (this.pmenuInfo.leval)+1;
          //将当前菜单的ID,付给下级菜单的父ID
          this.menuInfo.parentId = this.pmenuInfo.id;
          //添加
          this.$axios.post(uri,this.menuInfo).then(response=>{
            if(response.data.code ==200){
              //成功后清空并关闭模态框
              alert(response.data.success);
              this.pmenuInfo={};
              this.menuInfo={};
              this.dialogTableVisible = false;
              this.find();
            }else if(response.data.code ==500){
              alert(response.data.success);
            }
          }).catch(error=>{
            alert("没有权限");
          })
        },
        over(){
          //清空并关闭模态框
          this.pmenuInfo={};
          this.menuInfo={};
          this.dialogTableVisible = false;
        },
        resetForm(){
          this.menuInfo={};
        },
        handleNodeClick(data) {
          //点击后,弹出模态框
          this.dialogTableVisible = true;
          this.pmenuInfo = data;
        },
        handleCheckChange(checkedNodes,checkedKeys,halfCheckedNodes,halfCheckedKeys ) {
          console.log(checkedKeys);
        },
        filterNode(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },
        find(){
          //查询
          this.treeMenu=[];
          this.$axios.post(this.domain.serverpath+'findMenuAll').then((response)=> {
            if(response.data.code ==200){
            this.treeMenu = response.data.result;
            }else if(response.data.code ==500){
              alert(response.data.success);
            }
          }).catch(error=>{
            alert("没有权限");
          })
        }
      },
    }
</script>

<style scoped>

</style>
