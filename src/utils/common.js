import formatDuration from "format-duration";
import {
  createField as createFieldUtil,
  createFormData as createFormDataUtil,
  createColumn as createColumnUtil,
} from "../components/crud/utils";

import validator from "validator";
import Swal from "sweetalert2";
import { serverURL } from "./http";

const durify = (seconds) => formatDuration(seconds * 1000);
const round2 = (val) => Math.round(Number(val) * 100) / 100;
const randomId = () => `${Math.random()}`;

function sliceText(text, length = 30) {
  return text.length > length ? text.slice(0, length) + "..." : text;
}
function getServerAssetUrl(url) {
  if (!url) return "/default.png";
  if (url.startsWith("http")) {
    return url;
  } else {
    if (url.startsWith("/")) return serverURL + url;
    return serverURL + "/" + url;
  }
}

const errMsg = (err, defaultMsg = "Some error occured!") => {
  return err.response && err.response.data.message ? err.response.data.message : defaultMsg;
};

function usFormatMobileNo(mobile) {
  mobile = mobile.replaceAll(/[^0-9]/g, "").toString();
  const first3 = mobile.slice(0, 3);
  const second3 = mobile.slice(3, 6);
  const third4 = mobile.slice(6, 10);

  if (third4) {
    return `(${first3})-${second3}-${third4}`;
  }
  if (second3) {
    return `(${first3})-${second3}`;
  }
  if (first3) {
    return `(${first3})`;
  }
}

function showSuccessDialog(title = "", message = "") {
  Swal.fire({
    icon: "success",
    title,
    text: message,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      window.location.reload();
    }
  });
}

function confirmAction(title, message, onConfirm, warningText = "") {
  return new Promise((resolve, reject) => {
    warningText = warningText || "You won't be able to revert this!";

    Swal.fire({
      title: "Are you sure?",
      text: warningText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm!",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await onConfirm();
          Swal.fire({
            title: title,
            text: message,
            icon: "success",
          });
          resolve();
        }
      })
      .catch(reject);
  });
}

function createField(label, field = "", type = "text", required = false, value = "", options = []) {
  // for custom form field object for crud form
  return createFieldUtil(label, field, type, required, value, options);
}
function createColumn(label, field, type) {
  // for vue good table
  return createColumnUtil(label, field, type);
}
function createFormData(formValues) {
  return createFormDataUtil(formValues);
}

function isMobileNumber(val) {
  return val.length == 10 && /[0-9 -()+]+$/.test(val);
}
function isValidEmail(val) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
    val
  );
}

function validateEmail(email) {
  return validator.isEmail(email) && (email.includes(".com") || email.includes("."));
}

function validatePhone(phone) {
  return validator.isNumeric(phone) && phone.length === 10;
}
function formatIsoDate(date = new Date()) {
  return new Date(date).toISOString().slice(0, 10);
}

function daysToMs(days) {
  return days * 24 * 60 * 60 * 1000;
}

function usDateFormat(date, showTime = false) {
  // remove dependency on locale string conversions as its causing problem in -4 time
  if (!date) return date || "";

  const dateData = new Date(date);
  const isoString = dateData.toISOString();
  const [yyyy, mm, dd] = isoString.slice(0, 10).split("-");
  const [hh, min, sec] = isoString.slice(11, 19).split(":");

  const timeString = showTime
    ? `${parseInt(hh, 10) % 12 || 12}:${min.padStart(2, "0")} ${
        parseInt(hh, 10) >= 12 ? "PM" : "AM"
      }`
    : "";

  return `${mm}/${dd}/${yyyy} ${timeString}`;
}

function formatTimeToAMPM(time) {
  var hour = parseInt(time.substr(0, 2));
  var ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'
  var minutes = time.substr(3, 2);
  var seconds = time.substr(6, 2);
  var formattedTime = hour + ":" + minutes + " " + ampm;
  return formattedTime;
  // var time24 = '20:12:00';
  // var time12 = formatTimeToAMPM(time24);
  // console.log(time12); // Out
}

export {
  formatTimeToAMPM,
  createField,
  validateEmail,
  validatePhone,
  createColumn,
  createFormData,
  durify,
  isMobileNumber,
  isValidEmail,
  formatIsoDate,
  daysToMs,
  errMsg,
  showSuccessDialog,
  usFormatMobileNo,
  getServerAssetUrl,
  confirmAction,
  usDateFormat,
  round2,
  randomId,
  sliceText,
};
