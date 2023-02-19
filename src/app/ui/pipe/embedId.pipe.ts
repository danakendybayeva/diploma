import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'embedId'
})
export class EmbedIdPipe implements PipeTransform {
    constructor() {}
    transform(url: string) {
        url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

        if (RegExp.$3.indexOf('youtu') > -1) {
            return 'https://www.youtube.com/embed/' + RegExp.$6;
        } else if (RegExp.$3.indexOf('vimeo') > -1) {
            return 'https://player.vimeo.com/video/' + RegExp.$6;
        }
        return '';
    }
}
