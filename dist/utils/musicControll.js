const Util = require("./util");

/*全局数据*/
let playList = {}; //播放列表
let playData = {}; // 当前播放的数据
let playIndex = 0; //播放条目
let playState = false; //播放状态

// const musicPlayer = {};

class musicPlayer {
    constructor(props = {}) {
        this.playList = props.playList; //播放列表
        this.playData = props.playData; // 当前播放的数据
        this.playIndex = props.playIndex; //播放条目
    }


};



/*配置播放数据*/
musicPlayer.setOption = function(args) {
    playList = args.playList;
    playData = args.playData;
    playIndex = args.index;
    playState = args.playState;
    //数据存本地缓存
    wx.setStorageSync("playData", playData);
    wx.setStorageSync("playList", playList);
    wx.setStorageSync("playState", playState);
    wx.setStorageSync("playIndex", index);
    this.playMusic({
        playList: playList,
        index: playIndex,
    })
};



/**
 * 播放
 * @param  options={playList,index}   {播放列表 ,播放条目}
 * */
musicPlayer.playMusic = function(options = {}) {
    wx.playBackgroundAudio({
        dataUrl: playList[index].URL,
        title: playList[index].name,
        coverImgUrl: playList.thumbnail,
    })
};

/*停止*/
musicPlayer.stopMusic = function() {
    wx.getBackgroundAudioPlayerState({ // 小程序播放控制api
        success(res) {
            let status = res.status;
            console.info("stopMusic::", status)
            if (status === 1) { // 正在播放中
                // console.info("stopMusic::-11111")
                wx.pauseBackgroundAudio(); //暂停播放
                // that.setData({ isPlaying: false, });
                wx.setStorageSync("playState", false)

            } else if (status === 0) { // 正在暂停中
                wx.playBackgroundAudio({ title: playData.name, coverImgUrl: playData.songImg, dataUrl: playData.songUrl });
                // that.setData({ isPlaying: true, });
                wx.setStorageSync("playState", true)

                that.songPlay();
            }
        }
    })

};
/*下一首*/
musicPlayer.playNext = function() {
    let index = wx.getStorageSync("playIndex");
    index++;

    if (index >= that.data.songlists.song.length) {
        //列表播放结束，自动循环从第一首开始
        index = 0;
    }
    console.info("playNext", that.data.selectedIndex, index)

    that.setData({ selectedIndex: index })
    that.playMusic();

};

/*上一首*/
musicPlayer.playPrevious = function() {};

/* 播放进度状态控制 */
musicPlayer.songPlay = function() {
        clearInterval(timer);
        let timer = setInterval(function() {
            wx.getBackgroundAudioPlayerState({ // 调用小程序播放控制api
                success(res) {
                    let status = res.status;
                    if (status === 1) {
                        that.setData({
                            songState: {
                                progress: res.currentPosition / res.duration * 100,
                                currentPosition: Util.timeToString(res.currentPosition), // 调用转换时间格式
                                duration: Util.timeToString(res.duration) // 调用转换时间格式
                            }
                        });
                        // wx.setStorageSync('songState', that.data.songState);
                    } else if (status === 0) {
                        clearInterval(timer);
                    }
                }
            })
        }, 1000);
    },

    module.exports = musicPlayer;