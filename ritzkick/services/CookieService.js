//https://www.w3schools.com/js/js_cookies.asp
export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return undefined;
  }

export function setCookie(name, value, exdays){
    //"token=" + json.token + "; expires=Thu, 4 Feb 2022 12:00:00 UTC, Secure, Http-Only, SameSite=Strict"
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ", Secure, Http-Only, SameSite=Strict"
}

