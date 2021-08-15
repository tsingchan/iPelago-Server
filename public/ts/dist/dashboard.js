import { m, cc } from './mj.js';
import * as util from './util.js';
const title = m('div').text('Dashboard').addClass('display-6 my-5 text-center');
const Alerts = util.CreateAlerts();
const Index = cc('div', { children: [
        m('div').append([
            create_item('Timeline', '/public/timeline.html', '对外公开的时间线'),
            create_item('New Island', '/public/island-info.html', '新建小岛'),
            create_item('All Islands', '/public/islands.html', '我的全部小岛'),
        ]),
    ] });
$('#root').append([
    title,
    m(Alerts),
    m(Index).addClass('onLoggedIn').hide(),
    m(util.LoginArea).addClass('onLoggedOut'),
]);
function create_item(name, link, description) {
    return m('div').addClass('row mb-2 g-1').append([
        m('div').addClass('col text-end').append(m('a').text(name).attr({ href: link }).addClass('text-decoration-none')),
        m('div').addClass('col').text(description),
    ]);
}
init();
async function init() {
    const isLoggedIn = await util.checkLogin(Alerts);
    if (!isLoggedIn)
        return;
}
