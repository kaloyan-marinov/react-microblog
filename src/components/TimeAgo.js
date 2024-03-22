import { useState, useEffect } from "react";

const secondsTable = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];
// This class instantiated in the next statement is not well known,
// but is available in all modern browsers.
const rtf = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

function getTimeAgo(date) {
  /*
  Find the best relative units to use when rendering the `date: Date` object.

  (
  This is a standalone function, because
  it does not need to be different for each instantiation of the component,
  and it also does not need to change when the component re-renders.
  )
  */
  const seconds = Math.round((date.getTime() - new Date().getTime()) / 1000);
  const absSeconds = Math.abs(seconds);

  let bestUnit, bestTime, bestInterval;

  for (let [unit, unitSeconds] of secondsTable) {
    if (absSeconds >= unitSeconds) {
      bestUnit = unit;
      bestTime = Math.round(seconds / unitSeconds);
      bestInterval = Math.min(unitSeconds / 2, 60 * 60 * 24);
      break;
    }
  }

  if (!bestUnit) {
    // In this case, the time that needs to be rendered is less than a minute old.
    bestUnit = "second";
    bestTime = parseInt(seconds / 10) * 10;
    bestInterval = 10;
  }

  return [bestTime, bestUnit, bestInterval];
}

export default function TimeAgo({ isoDate }) {
  const date = new Date(Date.parse(isoDate));
  const [time, unit, interval] = getTimeAgo(date);
  // By only storing the setter function returned by the next statement,
  // we solve a very specific need that this component has,
  // which is to force itself to re-render
  // even though none of the inputs [i.e. props or state variables] ever change.
  // (
  // The only way to force a re-render is to create a dummy state variable
  // that is not used anywhere, but is changed when a re-render is needed.
  // )
  const [, setUpdate] = useState(0);

  useEffect(() => {
    // An alternative form for the setter,
    // [which] is useful
    // when the current value of the state variable is unknown or out of scope,
    // is to pass a function.
    // With this usage, React calls the function,
    // passing the current value of the [state] variable as an argument.
    //
    // Since this state variable is only needed to cause an update,
    // [this state variable can be updated to]
    // any value that is different from the current one.
    // In this component, the value of the state variable is incremented by one
    // every time an update needs to be triggered.
    const timerId = setInterval(
      () => setUpdate((update) => update + 1),
      interval * 1000
    );

    // This side effect function returns a function as a result,
    // [unlike] the one in the <Posts> component, which does not return anything.
    // Sometimes,
    // side effect functions allocate resources, such as the interval timer here,
    // and these resources need to be released
    // when the component is removed from the page,
    // to avoid resource leaks.

    // When a side effect function returns a function,
    // React calls this function
    // to allow the component to perform any necessary clean-up tasks.

    // For this component, the side effect clean-up function cancels the interval timer.
    return () => clearInterval(timerId);
  }, [interval]);

  return <span title={date.toString()}>{rtf.format(time, unit)}</span>;
}
