var HelloWorldLayer = cc.Layer.extend({
    candyArray : null,
    sprite:null,
    gameUI : null,
    m_nScore : 0,
    m_nLevel : 0,
    m_nStep : 0,
        ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var mainscene = ccs.load(res.MainScene_json);
        this.addChild(mainscene.node);

        //candy数组
        this.candyArray = new Array();
        for (var i = 0; i < DESK_ICON_HEIGHT; i++)
        {
            this.candyArray[i] = new Array();
        }

        //添加自己的精灵
        for (var indexX = 0; indexX < DESK_ICON_WIDTH; indexX++)
        {
            for (var indexY = 0; indexY < DESK_ICON_HEIGHT; indexY++)
            {
                this.candyArray[indexX][indexY] = new Candy(parseInt(Math.random()*CANDY_TYPE_COUNT), indexX, indexY);
                this.addChild(this.candyArray[indexX][indexY]);
            }
        }

        //gameui
        this.gameUI = new GameUI();
        this.gameUI.x = 0;
        this.gameUI.y = 640;
        this.gameUI.mainLayer = this;
        this.gameUI.hideTipWindow();
        this.addChild(this.gameUI, 100);

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

        //初始化游戏数
        this.m_nScore = 0;
        this.m_nLevel = 1;
        this.m_nStep = StepLevel[this.m_nLevel-1];
        this.updateGameInfo();

        /* you can create scene with following comment code instead of using csb file.
        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);
        */

        return true;
    },

    _onTouchBegan : function(touch, event){
        var xPos = Math.floor((touch.getLocation().x - DESK_BEGIN_X) / ICON_WIGHT);
        var yPos = Math.floor((touch.getLocation().y - DESK_BEGIN_Y) / ICON_HEIGHT);
        this.candyArray[xPos][yPos].setVisible(false);
    },

    _onMouseDown : function(event){
        var xPos = Math.floor((event.getLocation().x - DESK_BEGIN_X) / ICON_WIGHT);
        var yPos = Math.floor((event.getLocation().y - DESK_BEGIN_Y) / ICON_HEIGHT);

        var DelCandy = this.getDelCandy(xPos, yPos);
        if (DelCandy.length >= 3 && this.m_nStep > 0)
        {
            if (this.m_nStep <= 0)
            {
                return;
            }

            //步数减1
            this.m_nStep--;

            //更新游戏分数
            this.m_nScore += this.calScore(DelCandy.length);
            this.updateGameInfo();
            //进行消除
            this.delCandy(DelCandy);
            //填充图标
            this.fullCandy();

            //判断游戏是否结束
            if (this.m_nStep <= 0)
            {
                //分数不足，失败提示
                if (this.m_nScore < ScoreLimit[this.m_nLevel-1])
                {
                    this.gameUI.showTipWindows(3);
                    return;
                }
                //下一局判断
                this.nextLevel();
            }
        }
    },

    getDelCandy : function(xPos, yPos){
        var result = new Array();
        var waitAns = new Array();

        result.push(xPos+DESK_ICON_WIDTH*yPos);
        waitAns.push(xPos+DESK_ICON_WIDTH*yPos);
        while (waitAns.length != 0)
        {
            var index = waitAns.pop();
            var indexX = index % DESK_ICON_WIDTH;
            var indexY = parseInt(index / DESK_ICON_WIDTH);
            var bInResult = false;
            //判断上
            if (indexY+1 < DESK_ICON_HEIGHT && this.candyArray[indexX][indexY].m_nType == this.candyArray[indexX][indexY+1].m_nType)
            {
                bInResult = false;
                var shangIndex = indexX+(indexY+1)*DESK_ICON_HEIGHT;
                for (var i in result)
                {
                    if (result[i] == shangIndex)
                    {
                        bInResult = true;
                    }
                }

                if (!bInResult)
                {
                    waitAns.push(index);
                    result.push(shangIndex);
                    waitAns.push(shangIndex);
                    continue;
                }
            }
            //判断右
            if (indexX+1 < DESK_ICON_WIDTH && this.candyArray[indexX][indexY].m_nType == this.candyArray[indexX+1][indexY].m_nType)
            {
                bInResult = false;
                var youIndex = indexX+1+(indexY*DESK_ICON_HEIGHT);
                for (var i in result)
                {
                    if (result[i] == youIndex)
                    {
                        bInResult = true;
                    }
                }

                if (!bInResult)
                {
                    waitAns.push(index);
                    result.push(youIndex);
                    waitAns.push(youIndex);
                    continue;
                }
            }

            //判断下
            if (indexY - 1 >= 0 && this.candyArray[indexX][indexY].m_nType == this.candyArray[indexX][indexY-1].m_nType)
            {
                bInResult = false;
                var xiaIndex = indexX+(indexY-1)*DESK_ICON_HEIGHT;
                for (var i in result)
                {
                    if (result[i] == xiaIndex)
                    {
                        bInResult = true;
                    }
                }

                if (!bInResult)
                {
                    waitAns.push(index);
                    result.push(xiaIndex);
                    waitAns.push(xiaIndex);
                    continue;
                }
            }

            //判断左
            if (indexX-1 >= 0 && this.candyArray[indexX][indexY].m_nType == this.candyArray[indexX-1][indexY].m_nType)
            {
                bInResult = false;
                var zuoIndex = indexX-1+indexY*DESK_ICON_HEIGHT;
                for (var i in result)
                {
                    if (result[i] == zuoIndex)
                    {
                        bInResult = true;
                    }
                }

                if (!bInResult)
                {
                    waitAns.push(index);
                    result.push(zuoIndex);
                    waitAns.push(zuoIndex);
                    continue;
                }
            }
        }

        return result;
    },
    delCandy : function(delCandySprite)
    {
        if (delCandySprite.length >= 3)
        {
            for (var i in delCandySprite)
            {
                var xPos = delCandySprite[i] % DESK_ICON_WIDTH;
                var yPos = parseInt(delCandySprite[i] / DESK_ICON_WIDTH);
                this.candyArray[xPos][yPos].setVisible(false);
                this.candyArray[xPos][yPos].removeFromParent();
                this.candyArray[xPos][yPos] = null;
            }
        }
    },
    //糖果下落，填充
    fullCandy : function () {
        //寻找为空的列，以列为单位进行填充
        for (var xPos in this.candyArray)
        {
            var yPos = 0;
            while (yPos < this.candyArray[xPos].length)
            {
                if (this.candyArray[xPos][yPos] != null)
                {
                    yPos++;
                }
                else
                {
                    //剩余糖果全部下落
                    for (var index = yPos; index < this.candyArray[xPos].length-1; index++)
                    {
                        var tmpCandy = this.candyArray[xPos][index+1];
                        if (tmpCandy != null)
                        {
                            tmpCandy.resetPos(xPos, index);
                            this.candyArray[xPos][index+1] = null;
                            this.candyArray[xPos][index] = tmpCandy;
                        }
                    }
                    //最后一行要补充糖果
                    this.candyArray[xPos][DESK_ICON_HEIGHT-1] = new Candy(parseInt(Math.random()*CANDY_TYPE_COUNT), xPos, DESK_ICON_HEIGHT-1);
                    this.addChild(this.candyArray[xPos][DESK_ICON_HEIGHT-1]);
                }
            }
        }
    },

    //分数计算
    calScore : function(candyNum)
    {
        if (candyNum < 3)
        {
            return 0;
        }

        var unitScoreLevel = 0;
        if (candyNum < 5)
        {
            unitScoreLevel = 0;
        }
        else if (candyNum < 10)
        {
            unitScoreLevel = 1;
        }
        else
        {
            unitScoreLevel = 2;
        }

        return UnitScore[unitScoreLevel]*candyNum;
    },

    //刷新游戏信息
    updateGameInfo : function()
    {
        this.gameUI.labelScore.setString(this.m_nScore.toString());
        this.gameUI.labelLevel.setString(this.m_nLevel.toString());
        this.gameUI.labelStep.setString(this.m_nStep.toString());
        this.gameUI._labelTarScore.setString(ScoreLimit[this.m_nLevel-1].toString());
    },

    //关卡切换
    nextLevel : function()
    {
        if (this.m_nLevel >= 3)
        {
            //绘制游戏结束界面
            this.gameUI.showTipWindows(2);
        }
        else
        {
            this.gameUI.showTipWindows(1);
        }
    }

});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

