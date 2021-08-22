import { m, cc, span } from './mj.js';
import * as util from './util.js';
const allIslands = new Map();
let lastTime = dayjs().unix();
let firstTime = true;
const Alerts = util.CreateAlerts();
const Loading = util.CreateLoading();
const Title = cc('span');
const Subtitle = cc('h4', { classes: 'mt-3' });
const titleArea = m('div').addClass('my-5 text-center').append([
    m('div').addClass('display-4').append([
        m(Title).text('Timeline'),
        m('a').attr({ href: '/public/dashboard.html', title: 'dashboard' }).addClass('btn btn-sm btn-outline-dark ms-1').append(m('i').addClass('bi bi-gear')),
    ]),
    m(Subtitle),
]);
const MsgList = cc('ul', { classes: 'list-group list-group-flush my-5' });
const MoreBtn = cc('button', { classes: 'btn btn-outline-secondary' });
const MoreBtnArea = cc('div', { classes: 'text-center my-5', children: [
        m(MoreBtn).text('More').on('click', getPublicMessages),
    ] });
$('#root').append([
    titleArea,
    m(MsgList),
    m(Alerts).addClass('my-5'),
    m(Loading).addClass('my-5').hide(),
    m(MoreBtnArea),
]);
init();
function init() {
    initTitle();
    getPublicMessages();
}
function initTitle() {
    util.ajax({ method: 'GET', url: '/admin/get-titles', alerts: Alerts }, (resp) => {
        const titles = resp;
        Title.elem().text(titles.Title);
        Subtitle.elem().text(titles.Subtitle);
    });
}
function getPublicMessages() {
    Loading.show();
    if (firstTime) {
        var infoMsg = '没有公开消息';
        firstTime = false;
    }
    else {
        var infoMsg = '没有更多消息了';
    }
    const body = util.newFormData('time', lastTime.toString());
    util.ajax({ method: 'POST', url: '/api/more-public-messages', alerts: Alerts, body: body }, async (resp) => {
        var _a;
        const messages = resp;
        if (!messages || messages.length == 0) {
            Alerts.insert('primary', infoMsg);
            MoreBtnArea.elem().hide();
            return;
        }
        if (messages.length < util.everyPage) {
            MoreBtnArea.elem().hide();
        }
        for (const msg of messages) {
            const item = MsgItem(msg);
            MsgList.elem().append(m(item));
            await ((_a = item.init) === null || _a === void 0 ? void 0 : _a.call(item));
        }
        lastTime = messages[messages.length - 1].Time;
    }, undefined, () => {
        Loading.hide();
    });
}
function MsgItem(msg) {
    const MsgAlerts = util.CreateAlerts();
    const datetime = dayjs.unix(msg.Time).format('YYYY-MM-DD HH:mm:ss');
    const self = cc('div', { id: util.itemID(msg.ID), classes: 'list-group-item d-flex justify-content-start align-items-start MsgItem mb-3', children: [
            m('a').addClass('AvatarLink').append(m('img').addClass('Avatar')),
            m('div').addClass('ms-3 flex-fill').append([
                m('div').addClass('Name'),
                m('div').addClass('Contents fs-5'),
                m('div').addClass('Datetime small text-muted text-end').text(datetime),
                m(MsgAlerts),
            ]),
        ] });
    self.init = async () => {
        const island = await getIsland(msg.IslandID, MsgAlerts);
        if (!island)
            return;
        let avatar = '/public/avatar-default.jpg';
        if (island.Avatar)
            avatar = island.Avatar;
        const islandPage = '/public/island-messages.html?id=' + msg.IslandID;
        self.elem().find('.AvatarLink').attr({ href: islandPage });
        self.elem().find('.Avatar').attr({ src: avatar, alt: 'avatar' });
        const NameElem = self.elem().find('.Name');
        NameElem.append(m('a').text(island.Name).attr({ href: islandPage }).addClass('text-decoration-none'));
        if (island.Email) {
            NameElem.append(m('span').text(island.Email).addClass('small text-muted ms-1'));
        }
        const contentsElem = $(self.id).find('.Contents');
        const httpLink = msg.Body.match(util.httpRegex);
        if (!httpLink) {
            contentsElem.text(msg.Body);
        }
        else if (httpLink.index) {
            contentsElem.append([
                span(msg.Body.substring(0, httpLink.index)),
                m('a').text(httpLink[0]).attr({ href: httpLink[0], target: '_blank' }),
                span(msg.Body.substring(httpLink.index + httpLink[0].length)),
            ]);
        }
    };
    return self;
}
async function getIsland(id, alerts) {
    try {
        let island = allIslands.get(id);
        if (island)
            return island;
        island = await getIslandByID(id);
        allIslands.set(id, island);
        return island;
    }
    catch (err) {
        alerts.insert('danger', err);
    }
}
function getIslandByID(id) {
    const body = util.newFormData('id', id);
    return new Promise((resolve, reject) => {
        util.ajax({ method: 'POST', url: '/api/get-island', body: body }, (island) => {
            resolve(island);
        }, (errMsg) => {
            reject(errMsg);
        });
    });
}
window.update_title = (title) => {
    const body = util.newFormData('title', title);
    util.ajax({ method: 'POST', url: '/admin/update-title', alerts: Alerts, body: body }, () => {
        Title.elem().text(title);
        const infoMsg = '标题更新成功';
        Alerts.insert('success', infoMsg);
        console.log(infoMsg);
    });
};
window.update_subtitle = (subtitle) => {
    const body = util.newFormData('subtitle', subtitle);
    util.ajax({ method: 'POST', url: '/admin/update-subtitle', alerts: Alerts, body: body }, () => {
        Subtitle.elem().text(subtitle);
        const infoMsg = '副标题更新成功';
        Alerts.insert('success', infoMsg);
        console.log(infoMsg);
    });
};
