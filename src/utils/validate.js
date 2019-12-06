/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone(s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL(s) {
  return /^http[s]?:\/\/.*/.test(s)
}

// form 表单中验证手机号
export function validatePhone(rule, value, callback) {
  if (!value) {
    return callback(new Error('手机号不能为空'))
  } else {
    if (!isMobile(value)) {
      callback(new Error('手机号不能为空'))
    } else {
      callback()
    }
  }
}

// form 表单中验证 验证码
export function validateCode(rule, value, callback) {
  if (!value) {
    return callback(new Error('验证码不能为空'))
  } else {
    if (value.length < 4) {
      callback(new Error('验证码长度为4位'))
    } else {
      callback()
    }
  }
}

// form 表单中验证 密码
export function validatePassword(rule, value, callback) {
  if (!value) {
    return callback(new Error('密码不能为空'))
  } else {
    if (value.length < 6) {
      callback(new Error('密码长度最少为8位'))
    } else {
      callback()
    }
  }
}

// form 表单中验证 密码强度
export function validatePwdPower(rule, value, callback) {
  if (!value) {
    return callback(new Error('密码不能为空'))
  } else {
    const reg = /^(?![^a-zA-Z]+$)(?!\D+$)(?![a-zA-Z0-9]+$).{8,16}$/
    if (value.length < 8 || value.length > 16) {
      callback(new Error('密码长度为8-16个字符'))
    } else if (value.indexOf(' ') >= 0) {
      callback(new Error('不能包含空格'))
    } else if (!reg.test(value)) {
      callback(new Error('密码必须包含字母、数字和特殊字符'))
    } else {
      callback()
    }
  }
}

// form 表单中验证 确认密码是否想等
export function validateConfirmPwd(rule, value, callback) {
  if (!value) {
    return callback(new Error('确认密码不能为空'))
  } else {
    if (this.form.getFieldValue('password') !== value) {
      callback(new Error('两次输入的密码输入不一致'))
    } else {
      callback()
    }
  }
}

/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (typeof val === 'boolean') {
    return false
  }
  if (typeof val === 'number') {
    return false
  }
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true
    return false
  }
  return false
}
