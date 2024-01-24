//Add any functions that have to do with calculation done on html element to this file, so they can be reused

/*
* this function takes an html element with text and calculates the number of lines that are displayed
* */
export function countLines(element: HTMLElement):number {
    const divHeight = element.offsetHeight
    const computedStyle = getComputedStyle(element);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    return divHeight / lineHeight;
}
