// 配置對象
const config = {
    syntax: {
        keywords: ["if", "else", "for", "while"],
        operators: ["+", "-", "*", "/"],
        comments: ["//"]
    },
    completions: ["function", "variable", "constant"]
};

const editor = document.getElementById('editor');

editor.addEventListener('input', () => {
    const code = editor.textContent; // 或者使用 editor.innerText
    const highlightedCode = highlightSyntax(code, config.syntax);
    editor.innerHTML = highlightedCode;
});


// 提供代碼補全
editor.addEventListener('keydown', (event) => {
    const code = editor.value;
    const cursorPosition = editor.selectionStart;
    if (event.key === 'Tab') {
        event.preventDefault();
        const completedCode = codeCompletion(code, cursorPosition, config.completions);
        editor.value = completedCode;
    }
});

// 運行代碼
function runCode() {
    const code = editor.value;
    // 運行代碼的邏輯
    // ...
}

// 保存代碼
function saveCode() {
    const code = editor.value;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'code.txt';
    link.click();
}

// 根據配置文件進行語法高亮
function highlightSyntax(code, syntaxConfig) {
    let highlightedCode = code;
    const keywordsRegex = new RegExp(`\\b(${syntaxConfig.keywords.map(keyword => escapeRegex(keyword)).join('|')})\\b`, 'g');
    highlightedCode = highlightedCode.replace(keywordsRegex, '<span class="keyword">$1</span>');

    const operatorsRegex = new RegExp(`\\b(${syntaxConfig.operators.map(operator => escapeRegex(operator)).join('|')})\\b`, 'g');
    highlightedCode = highlightedCode.replace(operatorsRegex, '<span class="operator">$1</span>');

    const commentsRegex = new RegExp(`(${syntaxConfig.comments.map(comment => escapeRegex(comment)).join('|')}).*`, 'g');
    highlightedCode = highlightedCode.replace(commentsRegex, '<span class="comment">$1</span>');

    return highlightedCode;
}

// 輔助函數：對正則表達式中的特殊字符進行轉義
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 根據配置文件進行代碼補全
function codeCompletion(code, cursorPosition, completionsConfig) {
    const currentWord = getCurrentWord(code, cursorPosition);
    const filteredCompletions = completionsConfig.filter(completion => completion.startsWith(currentWord));
    if (filteredCompletions.length === 1) {
        const remaining = filteredCompletions[0].slice(currentWord.length);
        return code.slice(0, cursorPosition) + remaining + code.slice(cursorPosition);
    }
    return code;
}

// 輔助函數：獲取光標位置之前的當前單詞
function getCurrentWord(code, cursorPosition) {
    const beforeCursor = code.slice(0, cursorPosition);
    const matches = beforeCursor.match(/[\w]+$/);
    return matches ? matches[0] : '';
}
