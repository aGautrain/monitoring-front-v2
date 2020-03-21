import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThermometerHalf,
  faHumidity,
  faCalendarDay,
  faCameraAlt,
  faClock
} from "@fortawesome/pro-light-svg-icons";

import { faHumidity as faHumiditySolid } from "@fortawesome/pro-solid-svg-icons";

export function IconTemperature() {
  return <FontAwesomeIcon icon={faThermometerHalf} />;
}

export function IconHumidity({ solid = false }) {
  return solid ? (
    <FontAwesomeIcon icon={faHumiditySolid} />
  ) : (
    <FontAwesomeIcon icon={faHumidity} />
  );
}

export function IconCalendar() {
  return <FontAwesomeIcon icon={faCalendarDay} />;
}

export function IconTime() {
  return <FontAwesomeIcon icon={faClock} />;
}

export function IconPhoto() {
  return <FontAwesomeIcon icon={faCameraAlt} />;
}
