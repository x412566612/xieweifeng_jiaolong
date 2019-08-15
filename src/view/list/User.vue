<template>
  <div>
    <el-form :inline="true"  class="demo-form-inline">

      <el-form-item label="用户名">
        <el-input v-model="userName" placeholder="用户名"></el-input>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dates"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>


      <el-form-item label="性别">
        <el-select v-model="sex" placeholder="活动区域">
          <el-option label="全部" value="全部"></el-option>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>

      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="find(1)">查询</el-button>
      </el-form-item>
    </el-form>


    <template>
      <div>
        <el-button @click="add()" type="primary" size="small" v-if="flag1">添加</el-button>
        <el-button @click="downloadExcel()" type="primary" size="small">导出Excl表</el-button>
        <el-button @click="createExcel()" type="primary" size="small" v-if="flag2">导出所有用户</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="userList"
        tooltip-effect="dark"
        style="width: 100%">




        <el-table-column
          prop="userName"
          label="用户名"
          width="160">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>
                <!--<img src="'http://localhost:11000/'+ scope.row.portrait" height="40px">-->
                <el-image style="width: 40px; height: 40px" :src="'http://localhost:11000/'+scope.row.portrait"></el-image>
              </p>
              <p>用户名: {{ scope.row.userName }}</p>
              <p>登录名: {{ scope.row.loginName }}</p>
              <p>性  别: {{ scope.row.sexs }}</p>
              <p>电  话: {{ scope.row.tel}}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.userName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column
          prop="loginName"
          label="登录名"
          width="160">
        </el-table-column>

        <el-table-column
          prop="sexs"
          label="性别"
          width="160">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="电话"
          width="160">
        </el-table-column>


        <el-table-column
          label="图片路径"
          width="160">
          <template slot-scope="scope">
            <el-image :src="'http://localhost:11000/'+scope.row.portrait"></el-image>
          </template>
        </el-table-column>

        <el-table-column
          prop="roleInfo.roleName"
          label="已绑定角色"
          width="120">
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button @click="bandRoleForUser(scope.row)" type="text" size="small"  v-if="flag3">绑定角色</el-button>
            <el-button @click="update(scope.row)" type="text" size="small"  v-if="flag4">编辑</el-button>
            <el-button type="text" @click="open(scope.row)"  v-if="flag5">{{scope.row.status==1?'删除':'恢复'}}</el-button>
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

    <!-- 开始添加和编辑用户 -->
    <div>
      <el-dialog title="用户管理" :visible.sync="dialogFormVisible">
        <el-form :model="user">
          <el-form-item label="上传图片" :label-width="formLabelWidth" >
            <el-upload
              class="upload-demo"
              ref="upload"
              action="http://localhost:8091/savePortrait"
              :before-upload="beforeAvatarUpload"
              :show-file-list="true"
              :file-list="fileList"
              :auto-upload="false"
              :limit= "1"
              list-type="picture">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>


          <el-form-item  label="用户名" :label-width="formLabelWidth" >
            <el-input v-model="user.userName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item   label="登录名" :label-width="formLabelWidth">
            <el-input v-model="user.loginName" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-radio-group v-model="user.sexs">
              <el-radio-button label="男"></el-radio-button>
              <el-radio-button label="女"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item   label="手机号码" :label-width="formLabelWidth">
            <el-input v-model="user.tel" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input placeholder="请输入密码" v-model="user.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth">
            <el-input placeholder="请输入密码" v-model="repassword" show-password></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="over()">取 消</el-button>
          <el-button type="primary" @click="submitUpload()">确 定</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </div>
      </el-dialog>
    </div>

    <!--添加和编辑用户结束-->

    <!-- 弹出绑定的角色start -->
    <el-dialog title="绑定角色" :visible.sync="dialogTableVisible1">
      <template>
        角色：<el-select
        v-model="roleValue"
        filterable
        remote
        reserve-keyword
        :value-key="roleValue.id"
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        :loading="loading">
        <el-option
          v-for="item in roleOptions"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userQuxiao">取 消</el-button>
        <el-button type="primary" @click="userBaoCun">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 弹出绑定的角色end -->
  </div>
</template>

<script>
  export default {
    name: "User",
    data(){
      return{
        userList:[],//列表
        user:{},//用户对象
        condition:{},//查询条件
        pageNum:1,//当前页
        pageSize:5,//每页大小
        pageSizes:[2,3,5,10],
        total:0,//总条数
        userName:"",//用户姓名查询条件
        dates:[],//时间的查询条件
        sex:"",//性别的查询条件
        ids:[],//复选框的ID
        dialogFormVisible:false,//模态框
        dialogTableVisible1:false,//动态弹出框,用于动态查询角色,并绑定
        userId:"",//用于接收当前用户的ID
        formLabelWidth:"120px",
        imageUrl: '',//图片路径地址
        fileList:[],//上传的图片文件
        repassword:"",//重新输入的密码,用于验证密码是否输入错误
        loading:false,//样式,好像是一个会转的圈
        roleOptions:[],//查询出的所有角色
        roleValue:{},//角色对象
        excelData:[],//导出数据的集合,
        flag1:false,
        flag2:false,
        flag3:false,
        flag4:false,
        flag5:false,
        myuser:{}
      }
    },
    mounted() {
      //从全局变量取出参数,这里可以改为从本地session中取出参数
      this.user = this.$store.state.userinfo;
      if(this.user.authmap.insertUserInfo=="true"){
        this.flag1 =true;
      }
      if(this.user.authmap.createExcel=="true"){
        this.flag2 =true;
      }
      if(this.user.authmap.insertUserAndRoles=="true"){
        this.flag3 =true;
      }
      if(this.user.authmap.updateUserInfo=="true"){
        this.flag4 =true;
      }
      if(this.user.authmap.deleteUserInfo=="true"){
        this.flag5 =true;
      }
      this.myuser = this.$store.state.userinfo;
      this.find(1);
      this.remoteMethod("");
    },
    methods:{
      createExcel(){
        this.$axios.post(this.domain.serverpath+'createExcel').then((response)=>{
          alert("开始下载");
        })
      },
      //导出当前页面选中的数据
      downloadExcel() {
        this.$confirm('确定下载列表文件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.excelData = this.userList //你要导出的数据list。
          this.export2Excel()
        }).catch(() => {

        });
      },
      //数据写入excel
      export2Excel() {
        var that = this;
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/excel/export2Excel');//这里必须使用绝对路径，使用@/+存放export2Excel的路径
          const tHeader = ['用户名','登录名','性别','电话', '图片路径', '已绑定角色']; // 导出的表头名信息
          //roleInfo.roleName 这里有BUG,这里无法使用对象点的方式取值,如果要获取roleInfo.roleName,得在实体类里面,加roleName字段
          //并且在查询的时候,使用别名,给roleName字段赋值
          const filterVal = ['userName','loginName', 'sexs', 'tel', 'portrait', 'roleInfo.roleName']; // 导出的表头字段名，需要导出表格字段名
          const list = that.excelData;
          const data = that.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '下载数据excel');// 导出的表格名称，根据需要自己命名
        })
      },
      //格式转换，直接复制即可
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      },
      userBaoCun(){
        this.$data.loading8=true
        //数据
        let params={}
        params.userId=this.$data.userId
        params.roleId=this.$data.roleValue
        this.$axios.post(this.domain.serverpath+'insertUserAndRoles',params).then((response)=>{
          //打开提示
          this.$notify.success({
            title: '提示',
            message: '保存成功！'
          });
          //关闭加载层
          this.$data.loading8=false
          //清除数据
          this.$data.roleValue={};
          //关闭弹出层
          this.$data.dialogTableVisible1=false
          //刷新数据
          this.find(1);
          /*  let pageInfo={}
            pageInfo.pageNo=this.$refs.pageRef.currentPage
            this.toPage(pageInfo)*/
        }).catch(error=>{
          alert("没有权限");
        })
      },
      remoteMethod(query){//远程搜索
        this.$data.loading8=true//开启加载样式
        this.$data.roleOptions = []//防止渲染不刷新,先清空参数
        //查询
        this.$axios.post(this.domain.serverpath+'findRoleInfoAll',{query:query}).then((response)=>{
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
      userQuxiao(){
        //清空
        this.$data.roleValue={};
        //关闭串口
        this.$data.dialogTableVisible1=false
      },
      bandRoleForUser(row){//给用户绑定角色
        if(row.roleInfo==null||this.myuser.roleInfo.leval<row.roleInfo.leval){
          this.$data.roleValue={};
          this.$data.dialogTableVisible1=true
          this.$data.userId=row.id
        }else {
          this.$message({
            type: 'info',
            message: '没有足够权限'
          });
          return;
        }

      },
      open(row) {
        if(row.roleInfo==null||this.myuser.roleInfo.leval<row.roleInfo.leval){
          let s = row.status==1?'删除':'恢复';
          this.$confirm('此操作将'+s+'该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //调用删除方法
            this.del(row);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }else {
          this.$message({
            type: 'info',
            message: '没有足够权限'
          });
          return;
        }

      },
      add(){
        this.user={};
        this.imageUrl="";
        this.repassword=""
        this.dialogFormVisible = true;
      },
      update(obj){
        this.user={};
        this.imageUrl="";
        this.repassword=""
        this.user=obj;
        this.imageUrl ='http://localhost:11000/'+ obj.portrait;
        this.dialogFormVisible = true;
      },
      save(){//这个保存方法,图片是只能保存到本地,不能保存到fastDFS,如果要保存到fastDFS,则方法需要修改
        /*console.log(this.$refs.upload);*/
        //验证参数是否为空
        if(this.user.loginName==""||this.user.userName==""||this.user.password==""||this.user.tel==""){
          alert("参数不能为空")
          return;
        }else if(this.user.password!=this.repassword){
          alert("两次输入的密码不一致");
        }
        let  uri = this.domain.serverpath+"updateUserInfo";
        //根据ID,判断是添加还是修改
        if(this.user.id==null){
          uri = this.domain.serverpath+"insertUserInfo";
          //添加时,验证登录名是否存在
          this.$axios.post(this.domain.serverpath+"findUserInfoByLoginName",{loginName:this.user.loginName}).then(response=>{
            if(response.data.code ==200){
              alert(response.data.success);
              //添加
              this.addUser(uri);
            }else if(response.data.code ==500){
              //存在则返回
              alert(response.data.success);
              return;
            }
          }).catch(error=>{
            alert("没有权限");
          })
        }else {
          this.addUser(uri);
        }

      },
      addUser(uri){
        //保存
        this.$axios.post(uri,this.user).then(response=>{
          if(response.data.code ==200){
            this.$refs.upload.submit();

            alert(response.data.success);
            this.dialogFormVisible = false;
            this.find(1);
          }else if(response.data.code ==500){
            alert(response.data.success);
          }
        }).catch(error=>{
          alert("没有权限");
        })
        /*this.$axios.post(this.domain.serverpath+"deletePortrait",this.user.portrait).then(response=>{
          console.log("清除提交的图片");
        })*/
      },
      over(){
        this.user={};
        this.imageUrl="";
        this.repassword=""
        this.dialogFormVisible = false;
      },
      resetForm(){
        this.user={};
        this.imageUrl="";
        this.repassword=""
      },
      /* handleAvatarSuccess(event,file, fileList) {
         if(file.name!=null){
          this.save();
         }else {
           this.user.portrait = this.user.sex ==1?"timg (10).jpg":"timg (1).jpg";
         }
         this.save();
         /!*this.imageUrl ='http://localhost:11000/'+ file.name;*!/
         /!*this.imageUrl = URL.createObjectURL(file.raw);*!/
       },*/
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

      //保存事件
      submitUpload() {
        //console.log(this.$refs.upload.uploadFiles[0].name); 获得要上传的图片名

        //判断是否有上传图片
        if(this.$refs.upload.uploadFiles[0]!=null&&this.$refs.upload.uploadFiles[0]!=undefined){
          this.user.portrait = this.$refs.upload.uploadFiles[0].name;
        }else {
          this.user.portrait = this.user.sexs=='男'?"timg (10).jpg":"timg (1).jpg";
        }
        //调用保存方法
        this.save();
      },

      handleSizeChange(val) {
        this.pageSize = val;
        this.find(1);
      },
      handleCurrentChange(val) {
        this.find(val);
      },
      find(pageNum){
        //查询
        this.condition.pageNum = pageNum;
        this.pageNum = pageNum;
        this.condition.pageSize = this.pageSize;
        this.condition.userName = this.userName;
        if(this.sex=="男"){
          this.condition.sexs = '1';
        }else if (this.sex=="女"){
          this.condition.sexs = '0';
        } else if (this.sex=="全部"){
          this.condition.sexs = '0,1';
        }
        if(this.dates==null){
          this.dates=[];
        }
        this.condition.str = this.dates[0]==null?'0000-01-01':this.dates[0];
        this.condition.end = this.dates[1]==null?'9999-12-31':this.dates[1];

        this.$axios.post(this.domain.serverpath+"findByUserInfo",this.condition).then(response=>{
          if(response.data.code ==200){
            this.userList = response.data.result.list;
            this.total = response.data.result.total;
          }else if(response.data.code ==500){
            alert(response.data.success);
          }
        }).catch(error=>{
          alert("没有权限");
        })
      },
      del(row){
        if(row.roleInfo==null||this.myuser.roleInfo.leval<row.roleInfo.leval){
          //删除和恢复方法
          let map = {};
          map.id = row.id;
          map.status = row.status==1?0:1;

          this.$axios.post(this.domain.serverpath+"deleteUserInfo",map).then(response=>{
            if(response.data.code ==200){
              alert(response.data.success);
              this.find(1);
            }else if(response.data.code ==500){
              alert(response.data.success);
            }
          }).catch(error=>{
            alert("没有权限");
          })
        }else {
          this.$message({
            type: 'info',
            message: '没有足够权限'
          });
          return;
        }
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
