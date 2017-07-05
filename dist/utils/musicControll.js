const Util = require("./util");

/*全局数据*/
var musicData = {};

const musicPlayer = {
    // constructor(props = {}) {
    // },
    lists: {}, //播放列表
    current: {}, // 当前播放的数据
    index: 0, //播放条目
    state: false, //播放状态
    songState: {}, //进度条状态
    /*配置播放数据*/
    setOption(options = {}) {
        //数据存本地缓存
        wx.setStorageSync("playData", options.current || this.current);
        wx.setStorageSync("playList", options.lists || this.lists);
        wx.setStorageSync("playing", options.state || this.state);
        wx.setStorageSync("playIndex", options.index || this.index);

        //全局设置参数
        options.current ? this.current = options.current : this.current;
        options.lists ? this.lists = options.lists : this.lists;
        options.state ? this.state = options.state : this.state;
        options.index ? this.index = options.index : this.index;

    },

    /**
     * 播放
     * @param  options={lists,index}   {播放书信息 ,播放条目}
     * */
    playMusic(options = {}) {
        let lists = options.lists;
        let index = this.index = options.index;
        console.log("playMusic", index);
        wx.playBackgroundAudio({
            dataUrl: lists.audio[index].URL,
            title: lists.audio[index].name,
            // coverImgUrl: lists.thumbnail,
        })
        this.setOption({ current: lists.audio[index], lists: lists, state: true, index: index })

    },

    /*停止*/
    stopMusic() {
        wx.getBackgroundAudioPlayerState({ // 小程序播放控制api
            success(res) {
                let status = res.status;
                // console.info("stopMusic::", status)

                if (status === 1) { // 正在播放中
                    console.info("stopMusic1")
                    wx.pauseBackgroundAudio(); //暂停播放
                    wx.setStorageSync("playing", false)

                } else if (status === 0) { // 正在暂停中
                    console.info("stopMusic2")

                    wx.setStorageSync("playing", true)

                    // wx.playBackgroundAudio({ title: playData.name, coverImgUrl: playData.songImg, dataUrl: playData.songUrl });
                }

            }
        })

    },
    /*下一首*/
    playNext() {
        let index = this.index;
        index++;
        if (index == this.lists.audio.length) {
            index = this.index = 0;
        }
        this.playMusic({ lists: this.lists, index: index });
        wx.setStorageSync("playIndex", index)
    },

    /*上一首*/
    playPrevious() {
        let index = this.index;
        index--;
        if (index < 0) {
            index = this.index = this.lists.audio.length - 1;
        }
        this.playMusic({ lists: this.lists, index: index });
        wx.setStorageSync("playIndex", index)
    },
    /* 播放进度状态控制 */
    // songPlay() {
    //     clearInterval(timer);
    //     let self = this;
    //     let timer = setInterval(function() {
    //         wx.getBackgroundAudioPlayerState({ // 调用小程序播放控制api
    //             success(res) {
    //                 let status = res.status;
    //                 if (status === 1) { //正在播放才需要计算进度条

    //                     let songState = {
    //                         progress: res.currentPosition / res.duration * 100,
    //                         currentPosition: Util.timeToString(res.currentPosition), // 调用转换时间格式
    //                         duration: Util.timeToString(res.duration) // 调用转换时间格式 
    //                     }
    //                     wx.setStorageSync("songState", songState)
    //                         // return songState;
    //                         // wx.setStorageSync('songState', that.data.songState);
    //                 } else if (status === 0) {
    //                     console.log("songPlay0");
    //                     clearInterval(timer);
    //                 } else if (status === 2) {
    //                     console.log("songPlay2");

    //                 }
    //             }
    //         })
    //     }, 1000);
    //     //监听音乐停止
    //     wx.onBackgroundAudioStop(() => {
    //         console.info("停止")
    //         this.playNext();
    //     })
    // },


    /*获取当前播放数据*/
    getMusicData() {
        this.index = wx.getStorageSync("playIndex")
        this.current = wx.getStorageSync("playData");
        this.lists = wx.getStorageSync("playList")
        this.state = wx.getStorageSync("playing")
        this.songState = wx.getStorageSync("songState"); //记录最终的进度条


        let musicData = {
            index: this.index,
            current: this.current,
            playList: this.lists,
            playing: this.state,
            songState: this.songState,
            // bookCat:
        }

        return musicData
    },






};





module.exports = musicPlayer;