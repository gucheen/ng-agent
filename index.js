var LogPanel = document.createElement('div');
LogPanel.classList.add('ng-log-panel');
var ScopeCode = document.createElement('code');
ScopeCode.classList.add('ng-scope-code');
LogPanel.appendChild(ScopeCode);
document.body.appendChild(LogPanel);

var init = function () {
  var app = document.querySelector('ng-app');
  var views = document.querySelectorAll('[ui-view]');

  console.log(app, views);

  [].forEach.call(views, function (view) {
    view.classList.add('ng-agent-view');
  });
}

var InitBtn = document.createElement('button');
InitBtn.textContent = 'NG-Agent';
InitBtn.style.position = 'fixed';
InitBtn.style.right = '5px';
InitBtn.style.top = '45%';
InitBtn.style.zIndex = '99999';

InitBtn.addEventListener('click', function () {
  init();
});

document.addEventListener('click', function (event) {
  if (event.target === InitBtn) {
    return;
  }

  var ancestView = findAncestor(event.target, 'ng-agent-view');

  if (ancestView) {
    var currentViewScope = angular.element(ancestView).scope();
    
    var scopeObj = {};
    
    for (var key in currentViewScope) {
      if (currentViewScope.hasOwnProperty(key) && !/\$/.test(key)) {
        scopeObj[key] = currentViewScope[key];
      }
    }
    
    var scopeJSON = syntaxHighlight(scopeObj);
    
    if (currentViewScope) {
      ScopeCode.innerHTML = scopeJSON;
    }
  }
});

document.body.appendChild(InitBtn);

function findAncestor(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}

function syntaxHighlight(json) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}