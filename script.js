/**
 * 尹毓恪 - 致粉丝的信
 * JavaScript 交互脚本
 * 功能：拆封动画、打开计数、内容渲染、增强效果
 */

// ==================== 可配置内容常量 ====================
const LETTER_CONFIG = {
    // 歌手署名
    artistName: '尹毓恪',
    
    // 信标题
    title: '致粉丝的信',
    
    // 副标题
    subtitle: 'A Letter For You',
    
    // 正文段落（数组）
    paragraphs: [
        '各位我的听众们，你们好，如果你们有缘打开这封信，说明在这个漫天盖地频率世界里，你进入到了我的世界几分钟。',
        
        '当然，新年快乐，不过我不只想说这个。',
        
        '你们还愿意打开这封信，证明你们是留下来的人，像珍珠一般镶嵌在最中心的大海里，连同我这一座小岛，都被你们映衬得闪闪发亮。',
        
        '就像你们写很多信给我一样，我也想在这个上一年与下一年的交界处，用一个不一样的形式，送你们一封信，诉衷心肠。',
        
        '大家都说音乐是天堂的声音，它的确通过一些声波，让我在偶然间感受到，在这个三维空间里，无法形容的一种存在，而我把这种存在，再通过我的频率，输送给有缘的你们，好似这一切就像一个圆，闭环了。',
        
        {
            type: 'quote',
            content: '旋律就算再优美，词藻就算再华丽，我觉得都不足以形容我们的关系和感情，这是一种别出心裁的交互，是一场最遥远的碰触，真相大白了，这就是爱。<br><br>不是小情小爱，而是最原始的爱，这就是地球唯一的终极答案。'
        },
        
        '"带着爱走下去"这是我对你们的第一个祝福，它可以帮你抵御一切刀山火海，让你在无论何时的尽头都不觉遗憾。',
        
        '"看向远方"这是我对你们的第二个祝福，它可以让你永远前行，抵达你心中的理想之地，希望是抵抗死亡的一剂良药。',
        
        '"看见周围的一切"这是我对你们的第三个祝福，它可以帮你把爱输送出去，相信我，爱很简单，你只要愿意真的擦亮眼睛看到大家，爱就出现了。',
        
        {
            type: 'quote',
            content: '而我呢？<br>"我的爱是一阵徐徐暖风，分不清何处来，也不一定吹向哪里。<br>我会带走你的味道，偷偷吹散你的坏心情，笑了就不留痕迹的去下一个地方，不会怪你，因为我们都很自由，只剩若有似无的温度，抓不住的感受，没有形状，但你却知道它一定来过。"'
        },
        
        'ps. 2026马上要推出的第四张专辑，也是我第一次这么大刀阔斧的操刀自己的专辑，希望大家都能从中获得一些什么，也期待新的一年与你们多多见面，安好。'
    ],
    
    // 落款前缀
    signaturePrefix: '爱你们的',
    
    // 落款日期
    signatureDate: '2025.12.30',
    
    // 页脚彩蛋
    // footerEasterEgg: '在这个漫天盖地的频率世界里，感谢你进入我的世界 🌊'
};

// ==================== 全局变量 ====================
let hasOpened = false; // 标记是否已拆封

// ==================== 核心功能：拆封交互 ====================
/**
 * 初始化信封拆封交互
 * 点击信封 → 信封消失 → 信纸展开 → 计数+1
 */
function initEnvelopeInteraction() {
    const envelopeContainer = document.getElementById('envelopeContainer');
    const letterContainer = document.getElementById('letterContainer');

    if (!envelopeContainer || !letterContainer) {
        console.error('无法找到信封或信纸容器元素');
        return;
    }

    envelopeContainer.addEventListener('click', function() {
        if (hasOpened) return; // 防止重复点击
        
        hasOpened = true;
        
        // 信封消失动画
        envelopeContainer.classList.add('opened');
        
        // 延迟显示信纸（等待信封动画完成）
        setTimeout(() => {
            letterContainer.classList.add('visible');
            
            // 打开成功后，增加计数
            incrementOpenCount();
        }, 600);
    });
}

// ==================== 功能：打开次数统计 ====================
/**
 * 增加打开次数计数
 * 使用 localStorage 存储，仅在成功拆封时调用
 */
function incrementOpenCount() {
    const STORAGE_KEY = 'letter_open_count';
    
    // 从 localStorage 获取当前计数
    let count = localStorage.getItem(STORAGE_KEY);
    
    if (count === null || count === undefined) {
        count = 0;
    } else {
        count = parseInt(count, 10);
    }
    
    // 计数加 1
    count++;
    
    // 保存回 localStorage
    localStorage.setItem(STORAGE_KEY, count);
    
    // 显示计数（带动画效果）
    displayOpenCount(count);
}

/**
 * 显示打开次数（带数字滚动动画）
 * @param {number} targetCount - 目标计数值
 */
function displayOpenCount(targetCount) {
    const counterElement = document.getElementById('openCount');
    
    if (!counterElement) {
        console.error('无法找到计数器元素');
        return;
    }
    
    let currentDisplay = 0;
    const increment = Math.ceil(targetCount / 40);
    const duration = 1500; // 动画持续时间（毫秒）
    const intervalTime = duration / (targetCount / increment);
    
    const timer = setInterval(() => {
        currentDisplay += increment;
        if (currentDisplay >= targetCount) {
            currentDisplay = targetCount;
            clearInterval(timer);
        }
        counterElement.textContent = currentDisplay.toLocaleString();
    }, intervalTime);
}

// ==================== 功能：渲染信件内容 ====================
/**
 * 根据配置对象动态渲染信件内容
 * 包括标题、正文段落、签名等
 */
function renderLetterContent() {
    // 设置标题
    const titleElement = document.getElementById('letterTitle');
    const subtitleElement = document.getElementById('letterSubtitle');
    
    if (titleElement) {
        titleElement.textContent = LETTER_CONFIG.title;
    }
    if (subtitleElement) {
        subtitleElement.textContent = LETTER_CONFIG.subtitle;
    }
    
    // 渲染正文段落
    const contentContainer = document.getElementById('letterContent');
    
    if (!contentContainer) {
        console.error('无法找到信件内容容器元素');
        return;
    }
    
    let contentHTML = '';
    
    // 遍历段落配置
    LETTER_CONFIG.paragraphs.forEach(item => {
        if (typeof item === 'string') {
            // 普通段落
            contentHTML += `<p class="letter-paragraph">${item}</p>`;
        } else if (item.type === 'quote') {
            // 引用/诗句
            contentHTML += `<div class="letter-quote">${item.content}</div>`;
        }
    });
    
    // 添加签名区域
    contentHTML += `
        <div class="letter-signature">
            <div>${LETTER_CONFIG.signaturePrefix}</div>
            <div class="signature-name">${LETTER_CONFIG.artistName}</div>
            <div class="signature-date">${LETTER_CONFIG.signatureDate}</div>
        </div>
    `;
    
    contentContainer.innerHTML = contentHTML;
    
    // 设置页脚彩蛋
    const footerElement = document.getElementById('footerMessage');
    if (footerElement) {
        footerElement.textContent = LETTER_CONFIG.footerEasterEgg;
    }
}

// ==================== 增强交互效果 ====================
/**
 * 初始化页面增强效果
 * 包括：鼠标视差效果、段落滚动淡入动画
 */
function initEnhancedEffects() {
    // 鼠标视差效果（仅在桌面端启用）
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', handleMouseParallax);
    }

    // 段落滚动淡入效果
    initScrollFadeIn();
}

/**
 * 鼠标视差效果处理函数
 * 插图元素会根据鼠标位置产生轻微位移
 */
function handleMouseParallax(e) {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.008;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.008;
    
    const spring = document.querySelector('.illustration-spring');
    const wave = document.querySelector('.illustration-wave');
    
    if (spring) {
        spring.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    if (wave) {
        wave.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
    }
}

/**
 * 初始化段落滚动淡入效果
 * 使用 Intersection Observer API 监听元素进入视口
 */
function initScrollFadeIn() {
    // 配置观察器选项
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    // 创建交叉观察器
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 1s ease-out forwards';
            }
        });
    }, observerOptions);

    // 等待信纸显示后，为段落添加观察器
    setTimeout(() => {
        const paragraphs = document.querySelectorAll('.letter-paragraph, .letter-quote');
        paragraphs.forEach(p => {
            p.style.opacity = '0'; // 初始设为透明
            observer.observe(p);
        });
    }, 1500);
}

// ==================== 音乐播放器功能 ====================
/**
 * 初始化音乐播放器
 * 控制播放/暂停
 */
function initMusicPlayer() {
    const playButton = document.getElementById('playButton');
    const bgAudio = document.getElementById('bgAudio');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    
    if (!playButton || !bgAudio) {
        console.warn('音乐播放器元素未找到');
        return;
    }
    
    // 播放/暂停按钮点击事件
    playButton.addEventListener('click', function() {
        if (bgAudio.paused) {
            // 播放音乐
            bgAudio.play().then(() => {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            }).catch(error => {
                console.error('音频播放失败:', error);
            });
        } else {
            // 暂停音乐
            bgAudio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    });
    
    // 音频结束时重置按钮状态
    bgAudio.addEventListener('ended', function() {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    });
    
    // 音频加载错误处理
    bgAudio.addEventListener('error', function() {
        console.error('音频文件加载失败');
    });
}

// ==================== 页面初始化 ====================
/**
 * 页面加载完成后的初始化流程
 */
window.addEventListener('DOMContentLoaded', function() {
    console.log('信件页面初始化中...');
    
    // 1. 渲染信件内容
    renderLetterContent();
    
    // 2. 初始化拆封交互
    initEnvelopeInteraction();
    
    // 3. 初始化增强效果
    initEnhancedEffects();
    
    // 4. 初始化音乐播放器
    initMusicPlayer();
    
    console.log('信件页面加载完成！');
});

// ==================== 工具函数 ====================
/**
 * 重置打开次数（用于调试）
 * 在浏览器控制台运行: resetOpenCount()
 */
function resetOpenCount() {
    localStorage.removeItem('letter_open_count');
    const counterElement = document.getElementById('openCount');
    if (counterElement) {
        counterElement.textContent = '0';
    }
    console.log('打开次数已重置');
}

// 将工具函数暴露到全局（方便调试）
window.resetOpenCount = resetOpenCount;

