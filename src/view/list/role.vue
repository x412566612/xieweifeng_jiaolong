<template>
    <div>
      <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="角色名">
          <el-input v-model="roleName" placeholder="角色名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="find(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <template>
        <div>
          <el-button @click="add()" type="primary" size="small" v-if="flag1">添加角色</el-button>
        </div>
        <el-table
          ref="multipleTable"
          :data="roleList"
          tooltip-effect="dark"
          style="width: 100%"
          >

          <el-table-column
            type="index"
            width="50">
          </el-table-column>


          <el-table-column
            prop="roleName"
            label="角色名称"
            width="160">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>角色名称: {{ scope.row.roleName }}</p>
                <p>角色描述: {{ scope.row.miaoShu }}</p>
                <p>捆绑用户: {{ scope.row.users }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.roleName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            prop="miaoShu"
            label="角色描述"
            width="160">
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            width="160">
            <template slot-scope="scope">
              <el-button @click="bandRoleForUser(scope.row)" type="text" size="small" v-if="flag2">编辑绑定权限</el-button>
              <el-button type="text" @click="open(scope.row)" v-if="flag3">删除</el-button>
              <el-button @click="clearRoleCorrelationAll(scope.row)" type="text" size="small" v-if="flag4">清除角色所有关联</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </template>


      <!-- 弹出绑定的菜单start -->
      <el-dialog title="编辑角色" :visible.sync="dialogTableVisible">
        <el-form :model="role">
          <el-form-item  label="角色名" :label-width="formLabelWidth" >
            <el-input v-model="role.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item   label="角色说明" :label-width="formLabelWidth">
            <el-input v-model="role.miaoShu" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item   label="上级角色" :label-width="formLabelWidth">
            <template>
              <el-select v-model="role.parentId" placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item   label="权限列表信息" :label-width="formLabelWidth">
            <el-tree
              :data="treeMenu"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="tree"
              :check-strictly="checkstrictly"
              highlight-current
              :props="defaultProps">
            </el-tree>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="userQuxiao">取 消</el-button>
          <el-button type="primary" @click="userBaoCun">绑定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出绑定的菜单end -->

    </div>
</template>

<script>
    export default {
        name: "role",
      data(){
          return{
            roleList:[],//列表
            pageNum:1,//当前页
            pageSize:5,//分页大小
            pageSizes:[2,3,5,10],//
            total:0,//数据总条数
            roleName:"",//角色名称
            role:{},//角色对象
            roleId:"",//角色ID
            dialogTableVisible:false,//绑定角色的模态框
            formLabelWidth:"120px",
            condition:{},//用于提交的对象
            treeMenu:[],//菜单列表
            defaultProps: {//tree树所需参数对应的参数名
              children: 'menuInfoList',
              label: 'menuName'
            },
            flag1:false,
            flag2:false,
            flag3:false,
            flag4:false,
            user:{},
            roleOptions:[],//查询出的所有角色
            loading:false,//样式,好像是一个会转的圈
            roleValue:{},
            checkstrictly:true
          }
      },
      mounted() {
        this.user = this.$store.state.userinfo;
        this.remoteMethod(this.user.roleInfo.id);
        if(this.user.authmap.insertRole=="true"){
          this.flag1 =true;
        }
        if(this.user.authmap.insertRole=="true"){
          this.flag2 =true;
        }
        if(this.user.authmap.insertUserAndRoles=="true"){
          this.flag3 =true;
        }
        if(this.user.authmap.insertUserAndRoles=="true"){
          this.flag4 =true;
        }
        this.find(1);//查询
        this.treeMenu = [];
        let map ={};
        map.id = this.user.id;
        this.$axios.post(this.domain.serverpath+'findMenuInfoByParentIdAndRoleId',map).then((response)=> {//查询所有菜单,给模态框赋值
          if(response.data.code ==200){
          this.treeMenu = response.data.result;//模态框赋值
          }else if(response.data.code ==500){
            alert(response.data.success);
          }
        }).catch(error=>{
          alert("没有权限");
        })
      },
      methods:{
        remoteMethod(query){//远程搜索
          this.$data.loading8=true//开启加载样式
          this.$data.roleOptions = []//防止渲染不刷新,先清空参数
          //查询
          this.$axios.post(this.domain.serverpath+'findRoleByParentId',{query:query}).then((response)=>{
            this.$data.loading8=false//关闭加载样式
            if(response.data.code ==200){
              //为data中的listMenu赋值
              this.$data.roleOptions=response.data.result;
            }else if(response.data.code ==500){
              alert(response.data.success);
            }
          }).catch(error=>{
            alert("没有权限");
            this.$data.loading8=false
          })
        },
        clearRoleCorrelationAll(row){
          if(row.roleInfo==null||this.user.roleInfo.leval<row.roleInfo.leval){
            let map = {};
            map.id = row.id;
            this.$axios.post(this.domain.serverpath+'clearRoleCorrelationAll',map).then((response)=>{
              //打开提示
              this.$notify.success({
                title: '提示',
                message: '清理成功！'
              });
              //刷新数据
              this.find(1);
            }).catch(error=>{
              alert("没有权限");
            })
          }else {
            alert("没有权限");
          }

        },
        userBaoCun(){//保存修改后的数据
          //数据
          this.role.menuIds = this.$refs.tree.getCheckedKeys();//获取选中的权限
          this.role.menuInfoList = null;
          let uri = this.domain.serverpath+'insertRole';
          if(this.role.id!=undefined){
            uri = this.domain.serverpath+'updateRole';
          }
          this.$axios.post(uri,this.role).then((response)=>{
            //打开提示
            this.$notify.success({
              title: '提示',
              message: '保存成功！'
            });
            //清除数据
            this.$refs.tree.setCheckedKeys([]);
            //关闭弹出层
            this.$data.dialogTableVisible=false
            //刷新数据
            this.find(1);
          }).catch(error=>{
            alert("没有权限");
          })
        },
        userQuxiao(){
          this.$refs.tree.setCheckedKeys([]);//清空tree树内参数
          //关闭串口
          this.$data.dialogTableVisible=false
        },
        bandRoleForUser(row){//给用户绑定角色
          if(row.roleInfo==null||this.user.roleInfo.leval<row.roleInfo.leval){
            this.role = {};//为防止重新赋值后参数不更新,先置空
            let map = {};
            map.id = row.id;
            //根据角色id,查询出角色的菜单权限
            this.$axios.post(this.domain.serverpath+"findRoleByRoleid",map).then((reponse)=>{
              setTimeout(() => {//由于渲染顺序问题,查询出的参数,必须在setTimeout内赋值,不然展示时没有参数
                this.$refs.tree.setCheckedKeys(reponse.data.result),0;
              })
              this.role = row;//将传入的当前类,赋值给角色对象
              this.$data.dialogTableVisible=true//打开模态框
            }).catch((error)=>{
              console.log("===error==="+error.message);
            })
          }else {
            alert("没有权限");
          }

        },
        open(id) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let map = {};
            map.id = id;
              //根据角色ID查询是否有绑定用户
              this.$axios.post(this.domain.serverpath+"findUserByRoleId",map).then(response=>{
                //没有绑定用户,才可以删除角色
                if(response.data.code ==200){
                  alert(response.data.success);
                  this.$axios.post(this.domain.serverpath+"deleteRole",map).then(response=>{
                    if(response.data.code ==200){
                      alert(response.data.success);
                      this.find(1);
                    }
                  }).catch(error=>{
                    alert("没有权限");
                  })
                }else {
                  alert(response.data.success);
                  return
                }
              }).catch(error=>{
                alert("没有权限");
              })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        find(pageNum){
          this.condition.pageNum = pageNum;
          this.condition.pageSize = this.pageSize;
          this.condition.roleName = this.roleName;
          //查询所有,带分页
          this.$axios.post(this.domain.serverpath+"findRoleByLikeNameAll",this.condition).then(response=>{
            if(response.data.code ==200){
              this.roleList = response.data.result.list;
              this.total = response.data.result.total;
            }else if(response.data.code ==500){
              alert(response.data.success);
            }
          }).catch(error=>{
            alert("没有权限");
          })
        },
        add(){
          //由于是添加,所以添加时,模态框不能有参数,所以置空角色
          this.role={};
          this.dialogTableVisible = true;
        },
        handleSizeChange(val) {
          //当前页展示页数改变时,重新查询
          this.pageSize = val;
          this.find(1);
        },
        handleCurrentChange(val) {
          //当前页改变时,重新查询
          this.find(val);
        },
      }
    }
</script>

<style scoped>

</style>
