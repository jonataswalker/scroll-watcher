export function resetProps(item) {
  item.isInViewport       = false;
  item.wasInViewport      = false;
  item.isAboveViewport    = false;
  item.wasAboveViewport   = false;
  item.isBelowViewport    = false;
  item.wasBelowViewport   = false;
  item.isPartialOut       = false;
  item.wasPartialOut      = false;
  item.isFullyOut         = false;
  item.wasFullyOut        = false;
  item.isFullyInViewport  = false;
  item.wasFullyInViewport = false;
}

export function resetPartialProps(item) {
  item.isInViewport       = false;
  item.isAboveViewport    = false;
  item.isBelowViewport    = false;
  item.isPartialOut       = false;
  item.isFullyOut         = false;
  item.isFullyInViewport  = false;
}

export function getProps(item) {
  return {
    isInViewport: item.isInViewport,
    isFullyInViewport: item.isFullyInViewport,
    isAboveViewport: item.isAboveViewport,
    isBelowViewport: item.isBelowViewport,
    isPartialOut: item.isPartialOut,
    isFullyOut: item.isFullyOut,
  };
}
