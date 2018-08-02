window.addEventListener('hashchange', () => router.update());
window.addEventListener('load', () => router.update());

const router = {
  routes: [],
  on(path) {
    const route = this.routes.find(route => this.urlMatchesRouteDefinition(path, route.def));
    if(route) {
      const params = this.parseParameters(path, route.def);
      route.fn(params);
    }
  },
  goTo(url) {
    window.location.hash = url;
  },
  update() {
    const path = window.location.hash.split("#").join("");
    router.on(path);
  },
  add(def, fn) {
    this.routes.push({
      def,
      fn,
    })
  },
  urlMatchesRouteDefinition(path, route) {
    const pathArray = path.split("/");
    const routeArray = route.split("/");
    if (pathArray.length !== routeArray.length) return false;
    return pathArray.reduce((previousResult, segment, i) => {
      const isDynamicSegment = routeArray[i].startsWith(":");
      if (isDynamicSegment) {
        return previousResult;
      } else {
        if (routeArray[i] === pathArray[i]) {
          return previousResult;
        } else {
          return false;
        }
      }
    }, true);
  },
  parseParameters(path, route) {
    const pathArray = path.split("/");
    return route.split("/").reduce((res, segment, i) => {
      if (segment.startsWith(":")) {
        const paramName = segment.slice(1);
        const value = pathArray[i];
        res[paramName] = isNaN(parseFloat(value)) ? value : parseFloat(value);
        return res;
      } else {
        return res;
      }
    }, {});
  }
};
