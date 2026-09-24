import { AgentAction, AgentIntentResult, CardDriverDelegate, CardOverlayType } from './types';

/**
 * CardDriver
 * Responsible for parsing natural language intents and dispatching driving actions
 * to the underlying functional card services (Focus, Timer, Alarm, Calendar, Podcast, Logbook).
 */
export class CardDriver {
  private delegate: CardDriverDelegate | null = null;

  public registerDelegate(delegate: CardDriverDelegate) {
    this.delegate = delegate;
  }

  public unregisterDelegate() {
    this.delegate = null;
  }

  /**
   * Directly dispatches an action to drive a card service
   */
  public executeAction(action: AgentAction): boolean {
    if (!this.delegate) {
      console.warn('[CardDriver] No delegate registered to execute action:', action);
      return false;
    }

    try {
      switch (action.type) {
        case 'OPEN_CARD':
          this.delegate.openOverlay(action.target);
          return true;

        case 'CLOSE_CARD':
          this.delegate.closeOverlay();
          return true;

        case 'START_FOCUS':
          this.delegate.openOverlay('focus');
          this.delegate.startFocus(action.durationSeconds);
          return true;

        case 'PAUSE_FOCUS':
          this.delegate.pauseFocus();
          return true;

        case 'RESET_FOCUS':
          this.delegate.resetFocus();
          return true;

        case 'START_TIMER':
          this.delegate.openOverlay('timer');
          this.delegate.startTimer(action.seconds);
          return true;

        case 'PAUSE_TIMER':
          this.delegate.pauseTimer();
          return true;

        case 'RESET_TIMER':
          this.delegate.resetTimer();
          return true;

        case 'DISMISS_ALARM':
          this.delegate.dismissAlarm();
          this.delegate.closeOverlay();
          return true;

        case 'PLAY_PODCAST':
          this.delegate.openOverlay('podcast');
          if (action.generateType && action.topic) {
            this.delegate.generatePodcastEpisode(action.generateType, action.topic);
          } else {
            this.delegate.playPodcast(action.episodeId);
          }
          return true;

        case 'PAUSE_PODCAST':
          this.delegate.pausePodcast();
          return true;

        case 'OPEN_SCHEDULE_PLANNER':
          this.delegate.openPlanner(action.item);
          return true;

        case 'SET_CONTEXT':
          this.delegate.setContext(action.context);
          return true;

        default:
          return false;
      }
    } catch (e) {
      console.error('[CardDriver] Error executing action:', e);
      return false;
    }
  }

  /**
   * Parses natural language user input, determines intent, and translates it
   * into a concrete agent card driving action.
   */
  public parseAndDriveIntent(text: string, activeOverlay: CardOverlayType): AgentIntentResult {
    const lowerText = text.toLowerCase().trim();

    // 1. Intent: Closing / Dismissing current active card
    const isClosingIntent = ['好的', '知道了', '拜拜', '再见', '退出', '关闭', '没事了', '停止', '休息吧', '不用了'].some(k => lowerText.includes(k));
    if (isClosingIntent) {
      if (activeOverlay) {
        this.executeAction({ type: 'CLOSE_CARD' });
        return {
          handled: true,
          isClosing: true,
          action: { type: 'CLOSE_CARD' },
          replyText: '好的，已为你收起卡片。有需要随时叫我哦！'
        };
      }
      return { handled: true, isClosing: true, replyText: '好哒，随时为你待命～' };
    }

    // 2. Intent: Pause / Continue running timers or focus
    if (lowerText.includes("暂停")) {
      if (activeOverlay === 'timer') {
        this.executeAction({ type: 'PAUSE_TIMER' });
        return { handled: true, replyText: '已为你暂停计时器。' };
      } else if (activeOverlay === 'focus') {
        this.executeAction({ type: 'PAUSE_FOCUS' });
        return { handled: true, replyText: '专注心流已暂停，稍后准备好随时继续。' };
      } else if (activeOverlay === 'podcast') {
        this.executeAction({ type: 'PAUSE_PODCAST' });
        return { handled: true, replyText: '播客已暂停播放。' };
      }
    }

    if (lowerText.includes("继续") || lowerText.includes("恢复")) {
      if (activeOverlay === 'timer') {
        this.executeAction({ type: 'START_TIMER' });
        return { handled: true, replyText: '计时器继续运行。' };
      } else if (activeOverlay === 'focus') {
        this.executeAction({ type: 'START_FOCUS' });
        return { handled: true, replyText: '继续保持专注心流，加油！' };
      }
    }

    // 3. Intent: Focus / Pomodoro
    if (lowerText.includes("专注") || lowerText.includes("番茄") || lowerText.includes("心流") || lowerText.includes("工作模式")) {
      // Check if duration is specified
      let durationSec = 25 * 60;
      if (lowerText.includes("45分钟") || lowerText.includes("45分")) durationSec = 45 * 60;
      else if (lowerText.includes("30分钟") || lowerText.includes("30分")) durationSec = 30 * 60;
      else if (lowerText.includes("60分钟") || lowerText.includes("1小时")) durationSec = 60 * 60;
      else if (lowerText.includes("15分钟") || lowerText.includes("15分")) durationSec = 15 * 60;

      this.executeAction({ type: 'START_FOCUS', durationSeconds: durationSec });
      return {
        handled: true,
        action: { type: 'START_FOCUS', durationSeconds: durationSec },
        replyText: `已为你开启 ${Math.round(durationSec / 60)} 分钟沉浸专注心流，已弹出专注卡片。`
      };
    }

    // 4. Intent: Countdown Timer
    if (lowerText.includes("倒计时") || lowerText.includes("计时器") || lowerText.includes("定时")) {
      let seconds = 5 * 60;
      if (lowerText.includes("10分钟") || lowerText.includes("10分")) seconds = 10 * 60;
      else if (lowerText.includes("15分钟") || lowerText.includes("15分")) seconds = 15 * 60;
      else if (lowerText.includes("3分钟") || lowerText.includes("3分")) seconds = 3 * 60;
      else if (lowerText.includes("1分钟") || lowerText.includes("1分")) seconds = 60;

      this.executeAction({ type: 'START_TIMER', seconds });
      return {
        handled: true,
        action: { type: 'START_TIMER', seconds },
        replyText: `已开启 ${Math.round(seconds / 60)} 分钟计时器。`
      };
    }

    // 5. Intent: Alarm Clock
    if (lowerText.includes("闹钟") || lowerText.includes("叫醒") || lowerText.includes("起床")) {
      this.executeAction({ type: 'OPEN_CARD', target: 'alarm' });
      return {
        handled: true,
        action: { type: 'OPEN_CARD', target: 'alarm' },
        replyText: '已为你打开拟物闹钟卡片，随时可以设定明日唤醒。'
      };
    }

    // 6. Intent: Schedule & Calendar Planner / Monthly Calendar Matrix
    if (lowerText.includes("月历") || lowerText.includes("整月") || lowerText.includes("月度") || lowerText.includes("全景日历") || lowerText.includes("本月安排")) {
      this.executeAction({ type: 'OPEN_CARD', target: 'calendar_flex' });
      return {
        handled: true,
        action: { type: 'OPEN_CARD', target: 'calendar_flex' },
        replyText: '已为你打开 AI 月历全景矩阵，查看整月战略里程碑与节点。'
      };
    }

    if (lowerText.includes("日程") || lowerText.includes("安排") || lowerText.includes("待办") || lowerText.includes("日历")) {
      this.executeAction({ type: 'OPEN_SCHEDULE_PLANNER' });
      return {
        handled: true,
        action: { type: 'OPEN_SCHEDULE_PLANNER' },
        replyText: '已为你打开日程规划卡片，查看今天的排期与待办。'
      };
    }

    // 7. Intent: AI Podcast Generation / Playback / Library
    if (lowerText.includes("节目库") || lowerText.includes("播客库") || lowerText.includes("全部播客") || lowerText.includes("知识库") || lowerText.includes("音频库")) {
      this.executeAction({ type: 'OPEN_CARD', target: 'podcast_library' });
      return {
        handled: true,
        action: { type: 'OPEN_CARD', target: 'podcast_library' },
        replyText: '已为你打开 AI 播客知识节目库，沉浸探索已归档的深度专题与内参。'
      };
    }
    if (lowerText.includes("故事") || lowerText.includes("讲个故事") || lowerText.includes("童话") || lowerText.includes("催眠")) {
      this.executeAction({ type: 'PLAY_PODCAST', generateType: 'video', topic: lowerText });
      return {
        handled: true,
        action: { type: 'PLAY_PODCAST', generateType: 'video', topic: lowerText },
        replyText: '好的，正在为你生成温暖的故事播客，马上播放～'
      };
    }

    if (lowerText.includes("资讯") || lowerText.includes("新闻") || lowerText.includes("最新消息") || lowerText.includes("晨报")) {
      this.executeAction({ type: 'PLAY_PODCAST', generateType: 'text', topic: lowerText });
      return {
        handled: true,
        action: { type: 'PLAY_PODCAST', generateType: 'text', topic: lowerText },
        replyText: '正在生成最新的早间科技资讯播客～'
      };
    }

    if (lowerText.includes("播客") || lowerText.includes("听点什么") || lowerText.includes("放点音乐") || lowerText.includes("白噪音")) {
      this.executeAction({ type: 'OPEN_CARD', target: 'podcast' });
      return {
        handled: true,
        action: { type: 'OPEN_CARD', target: 'podcast' },
        replyText: '已打开 AI 播客卡片，欢迎收听订阅频道。'
      };
    }

    // 8. Intent: Logbook
    if (lowerText.includes("记事本") || lowerText.includes("日记") || lowerText.includes("复盘") || lowerText.includes("总结")) {
      this.executeAction({ type: 'OPEN_CARD', target: 'logbook' });
      return {
        handled: true,
        action: { type: 'OPEN_CARD', target: 'logbook' },
        replyText: '已为你打开 AI 记事本，查看全天专注与数据洞察。'
      };
    }

    return { handled: false };
  }
}

export const cardDriver = new CardDriver();
