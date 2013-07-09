/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // imports

  var log = window.logFlags || {};
  
  // magic words
  
  var STYLE_SCOPE_ATTRIBUTE = 'element';
  var STYLE_CONTROLLER_SCOPE = 'controller';
  
  var styles = {
    STYLE_SCOPE_ATTRIBUTE: STYLE_SCOPE_ATTRIBUTE,
    /**
     * Installs external stylesheets and <style> elements with the attribute 
     * polymer-scope='controller' into the scope of element. This is intended
     * to be a called during custom element construction. Note, this incurs a 
     * per instance cost and should be used sparingly.
     *
     * The need for this type of styling should go away when the shadowDOM spec
     * addresses these issues:
     * 
     * https://www.w3.org/Bugs/Public/show_bug.cgi?id=21391
     * https://www.w3.org/Bugs/Public/show_bug.cgi?id=21390
     * https://www.w3.org/Bugs/Public/show_bug.cgi?id=21389
     * 
     * @param element The custom element instance into whose controller (parent)
     * scope styles will be installed.
     * @param elementElement The <element> containing controller styles.
    */
    // TODO(sorvell): remove when spec issues are addressed
    installControllerStyles: function() {
      var styleElement = this.element.controllerStyle;
      if (!styleElement) {
        styleElement = this.element.styleForScope(STYLE_CONTROLLER_SCOPE);
        this.element.controllerStyle = styleElement;
      }
      // apply controller styles, but only if they are not yet applied
      var scope = this.findStyleController();
      if (scope && !this.scopeHasElementStyle(scope, STYLE_CONTROLLER_SCOPE)) {
        // shim styling under ShadowDOMPolyfill
        if (window.ShadowDOMPolyfill) {
          Platform.ShadowCSS.shimPolyfillDirectives([styleElement],
              this.localName);
        }
        Polymer.applyStyleToScope(styleElement, scope);
      }
    },
    scopeHasElementStyle: function(scope, descriptor) {
      var rule = STYLE_SCOPE_ATTRIBUTE + '=' + this.localName + '-' + descriptor;
      return scope.querySelector('style[' + rule + ']');
    },
    findStyleController: function() {
      // find the shadow root that contains inNode
      var n = this;
      while (n.parentNode) {
        n = n.parentNode;
      }
      return n === wrap(document) ? document.head : n;
    }
  };

  // exports

  scope.api.instance.styles = styles;
  
})(Polymer);