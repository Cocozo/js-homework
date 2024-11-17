
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
const [getFlag, subscribe, setFlag, isValid] = (() => {
  const flags = {
    email_flag: {
      _value : true,
      _observers : new Set()
    },
    pw_flag: {
      _value : true,
      _observers : new Set()
    },
  };

  const getFlag = (flag) => {
    return flags[flag]._value;
  };

  const subscribe = (flag, observer) => {
    flags[flag]._observers.add(observer);
  }

  const setFlag = (flag, statue) => {
    if (typeof statue === "boolean") {
      flags[flag]._value = statue;
      notifyAll(flag);
    }
  };

  const notifyAll = (flag) => {
    flags[flag]._observers.forEach((observer) => observer());
  };

  const isValid = () => {
    if (flags.email_flag._value && flags.pw_flag._value) {
      return true;
    }
    return false;
  };
  return [getFlag, subscribe, setFlag, isValid];
})();

class EventHandler {
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

class InputEventHandler extends EventHandler {
  _key = null

  constructor(target, event, callbackmethood, key){
    super(target, event, callbackmethood);
    this._key = key;
    subscribe(this._key, this.render.bind(this));
  }

  render() {
    if(getFlag(this._key)) {
      this._target.classList.remove("is--invalid");
    }
    else {
      this._target.classList.add("is--invalid");
    }
  }

}

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
    setFlag("email_flag", true);
  } else {
    setFlag("email_flag", false);
  }
};

const passwordValidationCallback = (event) => {
  const value = event.target.value;
  if (pwReg(value)) {
    setFlag("pw_flag", true);
  } else {
    setFlag("pw_flag", false);
  }
};

const checkLoginInformation = () => {
  if(email_input.value === user.id) {
    if(pw_input.value === user.pw) {
      return true;
    }
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
  const email_eventHandler = new InputEventHandler(email_input, "input", emailValidationCallback, "email_flag");
  const pw_eventHandler = new InputEventHandler(pw_input, "input", passwordValidationCallback, "pw_flag");
  const submit_eventHandler = new EventHandler(form, "submit", onSubmitEventCallback)

  email_eventHandler.watch();
  pw_eventHandler.watch();
  submit_eventHandler.watch();

  console.log("onload!");
});
