/**
 * Created by zihao on 2018/4/9.
 */

//绘制游戏的分数 - 当前关卡，当前分数和剩余步数
var GameUI = cc.Layer.extend({
    labelLevel : null,
    labelScore : null,
    labelStep : null,
    _labelTarScore : null,
    mainLayer : null,
    tipWindow : null,
    tipWord : null,
    //1为下一局，2为游戏结束重新开始，3闯关失败重新开始
    showType : null,
    _listener : null,
    _onTouchBegan : null,
    _onMouseDown : null,
    ctor : function ()
    {
        this._super();

        var screenSize = cc.winSize;

        //绘制信息
        //关卡信息
        var labelLevelTitle = new cc.LabelTTF("关卡", "Arial", 30);
        labelLevelTitle.anchorX = 0.5;
        labelLevelTitle.anchorY = 0.5;
        labelLevelTitle.x = 70;
        labelLevelTitle.y = 30;
        this.addChild(labelLevelTitle);

        this.labelLevel = new cc.LabelTTF("1", "Arial", 25);
        this.labelLevel.anchorX = 0.5;
        this.labelLevel.anchorY = 0.5;
        this.labelLevel.x = 70;
        this.labelLevel.y = -5;
        this.addChild(this.labelLevel);

        //玩家分数
        var labelScoreTitle = new cc.LabelTTF("分数", "Arial", 30);
        labelScoreTitle.anchorX = 0.5;
        labelScoreTitle.anchorY = 0.5;
        labelScoreTitle.x = screenSize.width/2-65;
        labelScoreTitle.y = 30;
        this.addChild(labelScoreTitle);

        this.labelScore = new cc.LabelTTF("0", "Arial", 25);
        this.labelScore.anchorX = 0.5;
        this.labelScore.anchorY = 0.5;
        this.labelScore.x = screenSize.width/2-65;
        this.labelScore.y = -5;
        this.addChild(this.labelScore);

        //目标分数
        var labelTarScoreTitle = new cc.LabelTTF("目标", "Arial", 30);
        labelTarScoreTitle.anchorX = 0.5;
        labelTarScoreTitle.anchorY = 0.5;
        labelTarScoreTitle.x = screenSize.width/2+65;
        labelTarScoreTitle.y = 30;
        this.addChild(labelTarScoreTitle);

        this._labelTarScore = new cc.LabelTTF("10", "Arial", 25);
        this._labelTarScore.anchorX = 0.5;
        this._labelTarScore.anchorY = 0.5;
        this._labelTarScore.x = screenSize.width/2+65;
        this._labelTarScore.y = -5;
        this.addChild(this._labelTarScore);

        //剩余步数
        var labelStepTitle = new cc.LabelTTF("步数", "Arial", 30);
        labelStepTitle.anchorX = 0.5;
        labelStepTitle.anchorY = 0.5;
        labelStepTitle.x = screenSize.width - 70;
        labelStepTitle.y = 30;
        this.addChild(labelStepTitle);

        this.labelStep = new cc.LabelTTF("30", "Arial", 25);
        this.labelStep.anchorX = 0.5;
        this.labelStep.anchorY = 0.5;
        this.labelStep.x = screenSize.width - 70;
        this.labelStep.y = -5;
        this.addChild(this.labelStep);

        //提示框
        this.tipWindow = new cc.Sprite(res.TipBG);
        this.tipWindow.x = screenSize.width / 2;
        this.tipWindow.y = -screenSize.height / 2 + 120;
        this.tipWindow.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(this.tipWindow);

        var tipWindowSize = this.tipWindow.getContentSize();
        //提示信息
        this.tipWord = new cc.LabelTTF("", "Arial", 30);
        this.tipWord.setAnchorPoint(cc.p(0.5, 0.5));
        this.tipWord.x = tipWindowSize.width / 2;
        this.tipWord.y = tipWindowSize.height / 2 + 40;
        this.tipWindow.addChild(this.tipWord);

        //确定按钮
        var buttonOK = new cc.MenuItemImage(res.TipOK,res.TipOK,res.TipOK, this.touchOK, this);
        buttonOK.setAnchorPoint(cc.p(0.5, 0));
        buttonOK.x = tipWindowSize.width / 2;
        buttonOK.y = 30;

        var menu = new cc.Menu(buttonOK);
        menu.x = 0;
        menu.y = 0;

        this.tipWindow.addChild(menu);

        //添加监听器
        //this._listener = new cc.EventListener.create({
        //    event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //    swallowTouches: false,
        //    onTouchBegan: function(touch, event)
        //    {
        //        return true;
        //    }
        //});

        //事件监听
        if ("touches" in cc.sys.capabilities)
        {
            cc.eventManager.addListener({
                event : cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegin : this._onTouchBegan.bind(this)
            }, this);
        }
        else
        {
            cc.eventManager.addListener({
                event : cc.EventListener.MOUSE,
                onMouseDown : this._onMouseDown.bind(this)
            }, this);
        }


    },
    touchOK : function(){
        this.hideTipWindow();
        //更新关卡信息
        if  (1 == this.showType)
        {
            this.mainLayer.m_nLevel++;
        }
        else
        {
            this.mainLayer.m_nLevel = 1;
        }
        this.mainLayer.m_nScore = 0;
        this.mainLayer.m_nStep = StepLevel[this.mainLayer.m_nLevel-1];
        this.mainLayer.updateGameInfo();
    },
    showTipWindows : function(type){
        this.tipWindow.setVisible(true);
        this.showType = type;
        switch (type)
        {
            case 1:
                this.tipWord.setString("通过本局，请进行下一局!");
                break;
            case 2:
                this.tipWord.setString("恭喜你通关，请重新开始!");
                break;
            case 3:
                this.tipWord.setString("闯关失败，请重新开始!");
                break;
        }
    },
    hideTipWindow : function(){
        this.tipWindow.setVisible(false);
    },

    _onTouchBegan : function(touch, event){
        return true;
    },

    _onMouseDown : function(event){
        return true;
    }

});
