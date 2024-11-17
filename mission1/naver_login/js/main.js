
const user = {
  id:'asd@naver.com',
  pw:'spdlqj123!@'
}

/*

1. email 정규표현식을 사용한 validation
2. pw 정규표현식을 사용한 validation
3. 상태 변수 관리
4. 로그인 버튼을 클릭시 조건처리

*/
class Observer {
  _target = null;
  _callback_methood = null;
  _event = null;
  _onWatch = false;

  constructor(target, event, callbackmethood){
    this._target = target;
    this._event = event;
    this._callback_methood = callbackmethood;
  }

  watch() {
    this._target.addEventListener(this._event, this._callback_methood);
    this._onWatch = true;
  }

  disconnect() {
    this._target.removeEventListener(this._event, this._callback_methood);
    this._onWatch = false
  }

  changetCallbackMethood(callback) {

    if(this._onWatch){
      this.disconnect();
      this._callback_methood = callback;
      this.watch();
    } else {
      this._callback_methood = callback;
    }

  }
}

[setflag, isValid] = (() => {S
  const flags = {
    email_flag: false,
    pw_flag: false,
  };

  const setflag = (flag, statue) => {
    if (typeof statue === "boolean") {
      flags[flag] = statue;
    }
  };
  const isValid = () => {
    if (flags.email_flag && flags.pw_flag) {
      return true;
    }
    return false;
  };

  return [setflag, isValid];
})();

const form = document.querySelector(".login-form")
const email_input = document.querySelector(".user-email-input");
const pw_input = document.querySelector(".user-password-input");

function emailReg(text){
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(text).toLowerCase())
}

function pwReg(text){
  const re = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{6,16}$/;
  return re.test(String(text).toLowerCase());
}

const emailValidationCallback = (event) => {
  const value = event.target.value;
  if (emailReg(value)) {
    setflag("email_flag", true);
    event.target.classList.remove("is--invalid");
  } else {
    setflag("email_flag", false);
    event.target.classList.add("is--invalid");
  }
};

const passwordValidationCallback = (event) => {
  const value = event.target.value;
  if (pwReg(value)) {
    setflag("pw_flag", true);
    event.target.classList.remove("is--invalid");
  } else {
    setflag("pw_flag", false);
    event.target.classList.add("is--invalid");
  }
};

const checkLoginInformation = () => {
  if(email_input.value === user.id) {
    if(pw_input.value === user.pw) {
      return true;
    }
    return false;
  }
  return false;
}

const onSubmitEventCallback = (event) => {
  event.preventDefault();
  if(isValid() && checkLoginInformation()) {
    console.log("login_success!");
    window.location.href = "welcome.html";
  }
  else {
    console.log("no")
  }
}


window.addEventListener("load", (event) => {
  const email_observer = new Observer(email_input, "input", emailValidationCallback);
  const pw_observer = new Observer(pw_input, "input", passwordValidationCallback);
  const submit_observer = new Observer(form, "submit", onSubmitEventCallback)

  email_observer.watch();
  pw_observer.watch();
  submit_observer.watch();

  console.log("onload!");
});
