document.getElementById('clickme').addEventListener('click', async () => {
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('ai-response').innerHTML = '';

    try {
        const { defaultTemperature, maxTemperature, defaultTopK, maxTopK } =
            await LanguageModel.params();

        const available = await LanguageModel.availability();

        if (available !== 'unavailable') {
            const session = await LanguageModel.create();

            const condenseChecked = document.getElementById("condense-checkbox").checked;
            var condense = '';
            if (condenseChecked) {
                condense = 'Output is not more than 100 words.'
            }

            const text = document.getElementById("user-input").value.trim();

            const promptText = `Please provide information for: "${text}". "${condense}" Please use HTML tag for output, other than Markdown tag.`

            console.info(promptText);
            const stream = session.promptStreaming(promptText);
            var result = '';
            for await (const chunk of stream) {
                result += chunk;
                const cleaned = result.replace(/```[a-zA-Z]*\n?/g, '');
                document.getElementById("ai-response").innerHTML = cleaned;
            }

            console.log(result);
        }
    } catch (e) {
        console.error('Error:', e);
        document.getElementById('ai-advice').innerText = '❌ Something went wrong.';
    } finally {
        // 隐藏 spinner
        document.getElementById('spinner').style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('user-input');
    const button = document.getElementById('clickme');

    // 监听键盘事件
    input.addEventListener('keydown', function (event) {
        // 如果按下 Enter 并且没有按 Shift（Shift+Enter 允许换行）
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // 阻止换行
            button.click(); // 触发点击事件
        }
    });
});

