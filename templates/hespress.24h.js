(function(driver) {

    return driver.goto('%(url)s')
        .extract(function() {

            var listeUrls = document.querySelectorAll(".section_title a");
            let listLinks = [];
            for (let i = 0; i < listeUrls.length; i++) {
                listLinks.push(listeUrls[i])
            }
            return listLinks.join(';');

        });



});