ctx.beginPath();
            const valueAreaHorizonStart = MonitorStyleResized.PADDING*2 + this.titleLineWidth
            const valueHeight = paddedHeight-MonitorStyleResized.PADDING_VALUE_VIRTICAL*2;
            ctx.moveTo(valueAreaHorizonStart+MonitorStyleResized.CORNER_RADIUS, 
                    valueHeight+MonitorStyleResized.PADDING_VALUE_VIRTICAL);
            ctx.arcTo(valueAreaHorizonStart, 
                valueHeight+MonitorStyleResized.PADDING_VALUE_VIRTICAL,
                valueAreaHorizonStart, valueHeight - MonitorStyleResized.CORNER_RADIUS, 
                MonitorStyleResized.CORNER_RADIUS);
            ctx.arcTo(valueAreaHorizonStart, 
                MonitorStyleResized.PADDING_VALUE_VIRTICAL, 
                this.valueLineWidth+MonitorStyleResized.CORNER_RADIUS, 
                MonitorStyleResized.PADDING_VALUE_VIRTICAL, 
                MonitorStyleResized.CORNER_RADIUS);
            ctx.arcTo(valueAreaHorizonStart+this.valueLineWidth+MonitorStyleResized.CORNER_RADIUS, 
                MonitorStyleResized.PADDING_VALUE_VIRTICAL,
                valueAreaHorizonStart+this.valueLineWidth+MonitorStyleResized.CORNER_RADIUS, 
                valueHeight+MonitorStyleResized.PADDING_VALUE_VIRTICAL, 
                MonitorStyleResized.CORNER_RADIUS);
            ctx.arcTo(valueAreaHorizonStart+this.valueLineWidth+MonitorStyleResized.CORNER_RADIUS, 
                valueHeight+MonitorStyleResized.PADDING_VALUE_VIRTICAL, 
                valueAreaHorizonStart+MonitorStyleResized.CORNER_RADIUS, 
                valueHeight+MonitorStyleResized.PADDING_VALUE_VIRTICAL,
                MonitorStyleResized.CORNER_RADIUS);
            ctx.lineTo(valueAreaHorizonStart+MonitorStyleResized.CORNER_RADIUS, 
                valueHeight+MonitorStyleResized.PADDING_VALUE_VIRTICAL);                        
