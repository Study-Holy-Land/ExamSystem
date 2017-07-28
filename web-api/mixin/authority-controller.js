'use strict';

function authorityCtrl() {
  return [
    {
      originPath: [
        /^\/programs\/(.*)$/,
        /^\/messages\/(.*)$/
      ],
      role: [0, 1, 2, 3, 4, 9]
    }
  ];
}

module.exports = authorityCtrl;
