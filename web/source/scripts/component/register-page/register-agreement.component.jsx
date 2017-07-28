'use strict';


var registerAgreement = React.createClass({

  render: function () {
    return (
      <div>
        <div className="modal fade" id="registerAgreement" tabIndex="-1" role="dialog" aria-labelledby="agreementLabel">
          <div className="modal-dialog" role="document" aria-hidden="true">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                  aria-hidden="true">&times;</span></button>
                <h3 className="modal-title" id="myModalLabel">免责声明</h3>
              </div>
              <div id="agreement">
                <div className="modal-body">
                  <b>访问者在接受本网站服务之前，请务必仔细阅读本条款并同意本声明。访问者访问本网站的行为以及通过各类方式利用本网站的行为，都将被视作是对本声明全部内容的无异议的认可；如有异议，请立即跟本网站协商，并取得本网站的书面同意意见。</b><br/><br/>
                  第一条
                  访问者在从事与本网站相关的所有行为(包括但不限于访问浏览，利用，转载，宣传介绍)时，必须以善意且谨慎的态度行事；访问者不得故意或者过失的损害或者弱化本网站的各类合法权利与利益，不得利用本网站以任何方式直接或者间接的从事违反中国法律，国际公约以及社会公德的行为，且访问者应当恪守下述承诺：<br/>
                  1.传输和利用信息符合中国法律，国际公约的规定，符合公序良俗；<br/>
                  2.不将本网站以及与之相关的网络服务用作非法用途以及非正当用途；<br/>
                  3.不干扰和扰乱本网站以及与之相关的网络服务；<br/>
                  4.遵守与本网站以及与之相关的网络服务的协议，规定，程序和惯例等。<br/><br/>
                  第二条 本网站郑重提醒访问者，请在转载，上载或者下载有关作品时务必尊重该作品的版权，著作权；如果您发现有您未署名的作品，请立即和我们联系，我们会在第一时间加上您的署名或作相关处理。<br/><br/>
                  第三条
                  除我们另有明确说明或者中国法律有强制性规定外，本网站用户原创的作品，本网站及作者共同享有版权，其他网站及传统媒体如需使用，须取得本网站的书面授权，未经授权严禁转载或用于其它商业用途。<br/><br/>
                  第四条 本网站作品仅代表作者本人的观点，不代表本网站的观点和看法，与本网站立场无关，相关责任作者自负。<br/><br/>
                  第五条 本网站有权将在本网站内发表的作品用于其他用途，包括网站，电子杂志等，作品有附带版权声明者除外。<br/><br/>
                  第六条 未经本站和作者共同同意，其他任何机构不得以任何形式侵犯其作品著作权，包括但不限于，擅自复制，链接，非法使用或转载，或以任何方式建立作品镜像。<br/><br/>
                  第七条
                  本网站所刊载的各类形式(包括但不仅限于文字，图片，图表)的作品仅供参考使用，并不代表本网站同意其说法或描述，仅为提供更多信息，也不构成任何投资建议。对于访问者根据本网站提供的信息所做出的一切行为，除非另有明确的书面承诺文件，否则本网站不承担任何形式的责任。<br/><br/>
                  第八条
                  当本网站以链接形式推荐其他网站内容时，本网站并不对这些网站或资源的可用性负责，且不保证从这些网站获取的任何内容，产品，服务或其他材料的真实性，合法性，对于任何因使用或信赖从此类网站或资源上获取的内容，产品，服务或其他材料而造成(或声称造成)的任何直接或间接损失，本网站均不承担任何责任。<br/><br/>
                  第九条 访问者在本网站注册时提供的一些个人资料，本网站除您本人同意及第九条规定外不会将用户的任何资料以任何方式泄露给任何一方。<br/><br/>
                  第十条 当政府部门，司法机关等依照法定程序要求本网站披露个人资料时，本网站将根据执法单位之要求或为公共安全之目的提供个人资料。在此情况下之任何披露，本网站均得免责。<br/><br/>
                  第十一条 由于用户将个人密码告知他人或与他人共享注册账户，由此导致的任何个人资料泄露，本网站不负任何责任。<br/><br/>
                  第十二条 任何由于计算机问题，黑客攻击，计算机病毒侵入或发作，因政府管制而造成的暂时性关闭等影响网络正常经营的不可抗力而造成的个人资料泄露，丢失，被盗用或被窜改等，本网站均得免责。<br/><br/>
                  第十三条 由于与本网站链接的其他网站所造成之个人资料泄露及由此而导致的任何法律争议和后果，本网站均得免责。<br/><br/>
                  第十四条 本网站若因线路及非本公司控制范围外的硬件故障或其它不可抗力而导致暂停服务，于暂停服务期间造成的一切不便与损失，本网站不负任何责任。<br/><br/>
                  第十五条 域名因到期但未续费而引起的操作包括但不限于被删除，转移或被他人注册，易名中国概不负责，亦不承担任何法律责任，一切损失由申请人自行负责。<br/><br/>
                  第十六条
                  除本网站注明之服务条款外，其他一切因使用本网站而引致之任何意外，疏忽，诽谤，版权或知识产权侵犯及其所造成的损失(包括因下载而感染电脑病毒)，本网站概不负责，亦不承担任何法律责任。<br/><br/>
                  第十七条 若因本网站产生任何诉诸于诉讼程序的法律争议，将以本网站所有者所在的法院为管辖法院，除非中国法律对此有强制性规定。<br/><br/>
                  第十八条 本网站之声明以及其修改权，更新权及最终解释权均属思特沃克学院所有。<br/><br/>
                  第十九条 兹有以上网站法律声明即日起公布并生效，访问者须仔细阅读并同意本声明。访问者对本网站包括但不限于的访问浏览，利用，转载，宣传，链接等，均视为访问者同意本网站免责声明。
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="securityAgreement" tabIndex="-1" role="dialog" aria-labelledby="agreementLabel">
          <div className="modal-dialog" role="document" aria-hidden="true">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                  aria-hidden="true">&times;</span></button>
                <h3 className="modal-title" id="myModalLabel">保密协议</h3>
              </div>
              <div className="modal-body">
                <b>在答题之前，请务必仔细阅读本条款并同意本协议</b><br/><br/>
                第一条
                除我们另有明确说明或者中国法律有强制性规定外，本网站题目属于原创的作品，本网站及作者共同享有版权，其他网站及传统媒体如需使用，须取得本网站的书面授权，未经授权严禁转载或用于其它商业用途<br/><br/>
                第二条 未经本站和作者共同同意，其他任何机构不得以任何形式侵犯其作品著作权，包括但不限于，擅自复制，链接，非法使用或转载，或以任何方式建立作品镜像,一旦发现会追究当事人的责任<br/><br/>

                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal">确认</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = registerAgreement;
