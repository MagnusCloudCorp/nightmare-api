(function(driver) {

    return driver.goto('%(url)s')
        .extract(function() {

            var date = document.querySelector(".story_date").innerHTML;
            var articleHolder = document.querySelector("#article_holder");
            const title = articleHolder.querySelector('.page_title').innerHTML;
            const image = articleHolder.querySelector('.image').querySelector('img').getAttribute('src');

            const bodyHtml = articleHolder.querySelectorAll('#article_body  p');
            const paragraphs = []
            for (let i = 0; i < bodyHtml.length; i++) {
                paragraphs.push(bodyHtml.item(i).innerHTML)
            }

            const content = paragraphs.join('\n');
            return { title, image, content, date };


        });



});