import { select } from 'd3';

function wrapSVGText(text, width){
	text.each(function(){
		let text = select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1, // ems
			x = text.attr('x'),
			y = text.attr('y'),
			dy = 0.4,
			tspan = text
				.text(null)
				.append('tspan')
				.attr('x', x)
				.attr('y', y)
				.attr('dy', dy + 'em');
		while ((word = words.pop())) {
			line.push(word);
			tspan.text(line.join(' '));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(' '));
				line = [
					word
				];
				tspan = text
					.append('tspan')
					.attr('x', x)
					.attr('y', lineNumber + y)
					.attr('dy', ++lineNumber * lineHeight + dy + 'em')
					.text(word);
			}
		}
	});
}

export default wrapSVGText;
