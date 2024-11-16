FROM php:latest
WORKDIR /app
ENV FILE_CONTENT="<?php\\n\$data = readline('Enter a number: ');\\necho 'You entered: ' . \$data;\\n\$data = readline('Enter a number: ');\\necho 'You entered: ' . \$data;\\n?>"
ENV FILE_NAME="main"
ENV FILE_INPUT="hello\nyou\n"
CMD ["/bin/bash", "-c", "echo -e $FILE_CONTENT > ${FILE_NAME}.php && echo -n -e $FILE_INPUT | php ${FILE_NAME}.php"]