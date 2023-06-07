$(function () {
  // 为表单的必填文本框添加提示信息（选择form中的所有后代input元素）
  $("form :input.required").each(function () {
    // 通过jquery api：$("HTML字符串") 创建jquery对象
    var $required = $("<strong class='high' style='color:red;'>*</strong>");
    // 添加到this对象的父级对象下
    $(this).parent().append($required);
  });

  $('#name').blur(function () {
    $('.name').find('.msg').remove();
    var nameVal = $.trim(this.value); // 原生js去空格方式：this.replace(/(^\s*)|(\s*$)/g, "")
    var regName = /[~#^$@%&!*()<>:;'"{}【】]/;
    if (nameVal === "" || nameVal.length < 6 || regName.test(nameVal)) {
      var errorMsg = "err";
      // class='msg onError' 中间的空格是层叠样式的格式
      $('.name').append("<span class='msg onError'>" + errorMsg + "</span>");
    }
    else {
      var okMsg = "ok";
      $('.name').find(".high").remove();
      $('.name').append("<span class='msg onSuccess'>" + okMsg + "</span>");
    }
  })


  // // 为表单元素添加失去焦点事件
  // $("form :input").blur(function () {
  //   var $parent = $(this).parent();
  //   $parent.find(".msg").remove(); // 删除以前的提醒元素（find()：查找匹配元素集中元素的所有匹配元素）


  //   // 验证姓名
  //   if ($(this).is("#name")) {
  //     var nameVal = $.trim(this.value); // 原生js去空格方式：this.replace(/(^\s*)|(\s*$)/g, "")
  //     var regName = /[~#^$@%&!*()<>:;'"{}【】]/;
  //     if (nameVal == "" || nameVal.length < 6 || regName.test(nameVal)) {
  //       var errorMsg = "err";
  //       // class='msg onError' 中间的空格是层叠样式的格式
  //       $parent.append("<span class='msg onError'>" + errorMsg + "</span>");
  //     }
  //     else {
  //       var okMsg = "ok";
  //       $parent.find(".high").remove();
  //       $parent.append("<span class='msg onSuccess'>" + okMsg + "</span>");
  //     }
  //   }

  //   // 验证邮箱
  //   if ($(this).is("#email")) {
  //     var emailVal = $.trim(this.value);
  //     var regEmail = /.+@.+\.[a-zA-Z]{2,4}$/;
  //     if (emailVal == "" || (emailVal != "" && !regEmail.test(emailVal))) {
  //       var errorMsg = "err";
  //       $parent.append("<span class='msg onError'>" + errorMsg + "</span>");
  //     }
  //     else {
  //       var okMsg = "ok";
  //       $parent.find(".high").remove();
  //       $parent.append("<span class='msg onSuccess'>" + okMsg + "</span>");
  //     }
  //   }
  // }).keyup(function () {
  //   // triggerHandler 防止事件执行完后，浏览器自动为标签获得焦点
  //   $(this).triggerHandler("blur");
  // }).focus(function () {
  //   $(this).triggerHandler("blur");
  // });
})