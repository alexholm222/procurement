export function dateNow() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  let fMonth2;
  switch (month) {
    case 0: fMonth2 = "января"; break;
    case 1: fMonth2 = "февраля"; break;
    case 2: fMonth2 = "марта"; break;
    case 3: fMonth2 = "апреля"; break;
    case 4: fMonth2 = "мая"; break;
    case 5: fMonth2 = "июнья"; break;
    case 6: fMonth2 = "июлья"; break;
    case 7: fMonth2 = "августа"; break;
    case 8: fMonth2 = "сентября"; break;
    case 9: fMonth2 = "октября"; break;
    case 10: fMonth2 = "ноября"; break;
    case 11: fMonth2 = "декабря"; break;
    default:
  }

  return `${day} ${fMonth2} в ${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`
}


export function dateNow2() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
}




export function HandledatePurchaseList(n) {
  const date = new Date(n);
  const dateNow = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const day = date.getDate();

  const monthNow = dateNow.getMonth();
  const yearNow = dateNow.getFullYear();
  const dayNow = dateNow.getDate();

  let fMonth2;
  switch (month) {
    case 0: fMonth2 = "января"; break;
    case 1: fMonth2 = "февраля"; break;
    case 2: fMonth2 = "марта"; break;
    case 3: fMonth2 = "апреля"; break;
    case 4: fMonth2 = "мая"; break;
    case 5: fMonth2 = "июнья"; break;
    case 6: fMonth2 = "июлья"; break;
    case 7: fMonth2 = "августа"; break;
    case 8: fMonth2 = "сентября"; break;
    case 9: fMonth2 = "октября"; break;
    case 10: fMonth2 = "ноября"; break;
    case 11: fMonth2 = "декабря"; break;
    default:
  }

  const result = year < yearNow ? `${day < 10 ? `0${day}` : day}.${month + 1 < 10 ? `0${month + 1}` : month + 1}.${year}` : month == monthNow && day == dayNow ? 'Сегодня' : month == monthNow && (dayNow - day == 1) ? 'Вчера' : `${day} ${fMonth2}`

  return result;
}

export function HandledatePurchase(n) {
  const date = new Date(n);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  let fMonth2;
  switch (month) {
    case 0: fMonth2 = "января"; break;
    case 1: fMonth2 = "февраля"; break;
    case 2: fMonth2 = "марта"; break;
    case 3: fMonth2 = "апреля"; break;
    case 4: fMonth2 = "мая"; break;
    case 5: fMonth2 = "июнья"; break;
    case 6: fMonth2 = "июлья"; break;
    case 7: fMonth2 = "августа"; break;
    case 8: fMonth2 = "сентября"; break;
    case 9: fMonth2 = "октября"; break;
    case 10: fMonth2 = "ноября"; break;
    case 11: fMonth2 = "декабря"; break;
    default:
  }

  return `${day} ${fMonth2} ${year}`
}

export function HandledateContract(n) {
  const date = new Date(n);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate() - 1;

  return `${day}.${month < 10 ? `0${month}` : month}.${year}`
}

export function dateForLog(n) {
  const date = new Date(n);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hourses = date.getHours();
  const minutes = date.getMinutes();

  let fMonth2;
  switch (month) {
    case 0: fMonth2 = "января"; break;
    case 1: fMonth2 = "февраля"; break;
    case 2: fMonth2 = "марта"; break;
    case 3: fMonth2 = "апреля"; break;
    case 4: fMonth2 = "мая"; break;
    case 5: fMonth2 = "июнья"; break;
    case 6: fMonth2 = "июлья"; break;
    case 7: fMonth2 = "августа"; break;
    case 8: fMonth2 = "сентября"; break;
    case 9: fMonth2 = "октября"; break;
    case 10: fMonth2 = "ноября"; break;
    case 11: fMonth2 = "декабря"; break;
    default:
  }

  return `${day < 10 ? `0${day}` : day} ${fMonth2} ${year} в ${hourses < 10 ? `0${hourses}` : hourses}:${minutes < 10 ? `0${minutes}` : minutes}`
}

