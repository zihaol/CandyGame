/**
 * Created by zihao on 2018/4/8.
 */

var CANDY_TYPE_COUNT =  5;
var DESK_BEGIN_X = 20;
var DESK_BEGIN_Y = 120;
var ICON_WIGHT = 48;
var ICON_HEIGHT = 48;
var DESK_ICON_WIDTH = 10;
var DESK_ICON_HEIGHT = 10;
var LEVEL_MAX_NUM = 3;
var StepLevel = [20, 15, 10];
var ScoreLimit = [2000, 1500, 1200];
var UnitScore = [10, 20, 30];


//从棋盘开始的位置开始
var Candy = cc.Sprite.extend({
    m_nType : 0,
    m_nHang : 0,
    m_nLie : 0,

    ctor : function(type, hang, lie)
    {
        var spriteRes = res.MyEmoji_1_png;
        this.m_nType = type;
        switch (type)
        {
            case 0:
                spriteRes = res.MyEmoji_1_png;
                break;
            case 1:
                spriteRes = res.MyEmoji_2_png;
                break;
            case 2:
                spriteRes = res.MyEmoji_3_png;
                break;
            case 3:
                spriteRes = res.MyEmoji_4_png;
                break;
            case 4:
                spriteRes = res.MyEmoji_5_png;
                break;
        }
        this._super(spriteRes);
        this.setAnchorPoint(cc.p(0,0));
        this.init(hang, lie);
    },
    init : function(hang, lie)
    {
        this.m_nHang = hang;
        this.m_nLie = lie;
        this.updatePos();
    },

    //根据行号列号重新刷新位置
    updatePos : function()
    {
        this.x = DESK_BEGIN_X + ICON_WIGHT*this.m_nHang;
        this.y = DESK_BEGIN_Y + ICON_HEIGHT*this.m_nLie;
    },

    //重新设置位置
    resetPos : function(hang, lie)
    {
        this.m_nHang = hang;
        this.m_nLie = lie;
        this.updatePos();
    }
});

