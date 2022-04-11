/**
 * @param {Element|Array<Element>} element DOM node or array of nodes.
 * @param {String|Array<String>} classname Class or array of classes.
 * For example: 'class1 class2' or ['class1', 'class2']
 */
export function addClass(element, classname) {
    if (Array.isArray(element)) {
        element.forEach((each) => addClass(each, classname));

        return;
    }

    const array = Array.isArray(classname) ? classname : classname.split(/\s+/u);

    let i = array.length;

    while (i--) {
        if (!hasClass(element, array[i])) {
            if (element.classList) {
                element.classList.add(array[i]);
            } else {
                element.className = `${element.className} ${array[i]}`.trim();
            }
        }
    }
}

/**
 * @param {Element|Array<Element>} element DOM node or array of nodes.
 * @param {String|Array<String>} classname Class or array of classes.
 * For example: 'class1 class2' or ['class1', 'class2']
 * @param {Number|undefined} timeout Timeout to add a class.
 */
export function removeClass(element, classname) {
    if (Array.isArray(element) || NodeList.prototype.isPrototypeOf(element)) {
        element.forEach((each) => removeClass(each, classname));

        return;
    }

    const array = Array.isArray(classname) ? classname : classname.split(/\s+/u);

    let i = array.length;

    while (i--) {
        if (hasClass(element, array[i])) {
            if (element.classList) {
                element.classList.remove(array[i]);
            } else {
                element.className = element.className.replace(classRegex(array[i]), ' ').trim();
            }
        }
    }
}

/**
 * @param {Element} element DOM node.
 * @param {String} classname Classname.
 * @return {Boolean}
 */
export function hasClass(element, classname) {
    // use native if available
    return element.classList
        ? element.classList.contains(classname)
        : classRegex(classname).test(element.className);
}

/**
 * @param {Element|Array<Element>} element DOM node or array of nodes.
 * @param {String} classname Classe.
 */
export function toggleClass(element, classname) {
    if (Array.isArray(element)) {
        element.forEach((each) => toggleClass(each, classname));

        return;
    }

    // use native if available
    if (element.classList) {
        element.classList.toggle(classname);
    } else {
        hasClass(element, classname)
            ? removeClass(element, classname)
            : addClass(element, classname);
    }
}

export function getScroll() {
    return [
        window.pageXOffset ||
            (document.documentElement && document.documentElement.scrollLeft) ||
            document.body.scrollLeft,
        window.pageYOffset ||
            (document.documentElement && document.documentElement.scrollTop) ||
            document.body.scrollTop,
    ];
}

export function getViewportSize() {
    return {
        w: window.innerWidth || document.documentElement.clientWidth,
        h: window.innerHeight || document.documentElement.clientHeight,
    };
}

export function getDocumentHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

export function getOffset(element) {
    const rect = element.getBoundingClientRect();
    const { documentElement } = document;
    const left = rect.left + window.pageXOffset - documentElement.clientLeft;
    const top = rect.top + window.pageYOffset - documentElement.clientTop;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const right = left + width;
    const bottom = top + height;

    return { width, height, top, bottom, right, left };
}

function classRegex(classname) {
    // eslint-disable-next-line security/detect-non-literal-regexp
    return new RegExp(`(^|\\s+) ${classname} (\\s+|$)`, 'u');
}

export function isElement(object) {
    // DOM, Level2
    if ('HTMLElement' in window) {
        return !!object && object instanceof HTMLElement;
    }

    // Older browsers
    return !!object && typeof object === 'object' && object.nodeType === 1 && !!object.nodeName;
}
