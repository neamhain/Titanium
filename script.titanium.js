/**
 * Titanium : Hypertext presentation rendering framework
 *
 * Developed by Hx0A5F (Cichol Gricenchos)
 * Licenced under the LGPLv3
 *
 * heaven@isdev.kr
 * http://www.heavenlab.kr/
 **/

(function() {
	'use strict';
	
	if(window.chrome == undefined) {
		return;
	}
	
	$.fn.family = function(selector) {
		return this.parent().find(selector);
	};
	
	$.fn.grandpa = function() {
		return this.parent().parent();
	};
	
	var Titanium = new function() {
		this.contextData = {};
		this.slideIndex = this.eventIndex = 0;
		this.eventHistory = [];
		this.targetId = this.originHtml = '';
		this.logoDisplay = true;
		
		this.insertContext = function(contextObj) {
			Titanium.contextData[contextObj.itemName] = {
				isProtected: contextObj.isProtected,
				slideData: contextObj.slideData
			};
		};
		
		this.getContext = function() {
			return Titanium.targetId ? Titanium.contextData[Titanium.targetId].slideData : null;
		};
		
		this.showContext = function(contextId, protectKey) {
			var slideData = Titanium.contextData[contextId].slideData;
			Titanium.targetId = contextId;
			
			// Initialize area for presentation to show.
			if(!$('body > #Titanium').length) {
				Titanium.originHtml = $('script').last().html().trim();
				
				$('body').html('<section id="Titanium"><section id="Slides"></section><section id="Navigations"></section><section id="Decrypt"></section><section id="Dialog"></section><section id="Shell"></section><section id="Initializer"></section></section>');
				$('#Navigations').html('<section><input type="button" value="" /><input type="button" value="" /></section><section><input type="button" value="" /><input type="button" value="" /></section><section><section></section></section>');
				$('#Decrypt').html('<section><span>Cipher code</span><input type="text" placeholder="Input the cipher code of encrypted slide data." /></section>');
				$('#Dialog').html('<section><h1>Dialog Title</h1><p>Hello, world!</p><section><button>Cancel</button><button>OK</button><input type="text" /></section></section>');
				$('#Shell').html('<section><h1>Interactive data modification tool</h1><section><section></section><section></section></section><section><button>Close</button></section></section>');
				
				$('#Navigations input').eq(0).click(function() {
					if($('#Shell').css('display') == 'none') {
						Titanium.Control.Shell.Show();
					}
				});
				
				$('#Navigations input').eq(1).click(function() {
					if($('#Dialog').css('display') == 'none') {
						Titanium.Control.Dialog.Show('Titanium dissolution', 'Do you want to exit the program really?', 320, 160, 'normal', function() {
							window.open('', '_self', '');
							window.close();
						});
					}
				});
				
				$('#Navigations input').eq(2).click(Titanium.Control.Slide.prevFlip);
				$('#Navigations input').eq(3).click(Titanium.Control.Slide.nextFlip);
				
				$('#Decrypt input').keydown(function(Event) {
					if(Event.keyCode == 13) {
						var tmpData = CryptoJS.AES.decrypt(slideData, $(this).val().trim()).toString(), decryptedCode = '', tmpData;
					
						for(var Loop = 0; Loop < tmpData.length / 2; Loop++) {
							decryptedCode += String.fromCharCode(parseInt(tmpData.substr(Loop * 2, 2), 16));
						}
						
						try {
							tmpData = eval(unescape(decryptedCode));
						} catch(exceptionObj) {
							$(this).val('');
							
							$(this).parent().css({
								marginLeft: -278,
								background: 'rgb(204, 0, 0)'
							});
							
							var threadList = [
								function() {
									$('#Decrypt section').css({
										marginLeft: -282
									});
								},
								function() {
									$('#Decrypt section').css({
										marginLeft: -278
									});
								},
								function() {
									$('#Decrypt section').css({
										marginLeft: -282,
										background: 'rgb(51, 181, 229)'
									});
								},
								function() {
									$('#Decrypt section').css({
										marginLeft: -278
									});
								},
								function() {
									$('#Decrypt section').css({
										marginLeft: -280
									});
								},
							];
							
							for(var Count = 1; Count <= threadList.length; Count++) {
								setTimeout(threadList[Count], 50 * Count);
							}
						}
						
						if(tmpData instanceof Array) {
							$('#Decrypt').fadeOut('slow', function() {
								$('body').removeClass('Decrypt');
								
								$('#Initializer').show();
								$('#Titanium').hide();
								
								setTimeout(function() {
									Titanium.showContext(Titanium.targetId, $('#Decrypt input').val().trim());
								}, 250);
							});
						}
					}
				});
				
				$('#Shell button').add($('#Dialog button').eq(0)).click(function() {
					$(this).grandpa().animate({
						top: parseInt($(this).grandpa().css('top')) * 1.125,
						opacity: 0
					}, {
						queue: false,
						duration: 375
					}).parent().fadeOut();
				});
				
				$('#Shell > section > section:nth-child(2)').click(function() {
					if(window.getSelection().isCollapsed && $('#Shell > section > section:nth-child(2) > section:last-child').html().trim().length > 0) {
						var Selection = window.getSelection(), selectionRange = document.createRange(), Offset = $(this).children('section').last().get(0).childNodes.length;
						
						selectionRange.setStart($(this).children('section').last().get(0), Offset);
						selectionRange.setEnd($(this).children('section').last().get(0), Offset);
						Selection.removeAllRanges();
						Selection.addRange(selectionRange);
					} else {
						$('#Shell > section > section:nth-child(2) > section:last-child').focus();
					}
				}).children('section').last().keydown(function(Event) {
					if(!Event.shiftKey && Event.keyCode == 13 && $(this).text().length > 0) {
						var isError, errorObject, queryResult;
						
						try {
							queryResult = window.eval($(this).text().split(String.fromCharCode(10)).join(';').split('\'').join('"'));
						} catch(Exception) {
							isError = true;
							errorObject = Exception;
						}
						
						$('#Shell > section > section:nth-child(2) > section:first-child').get(0).appendChild($('<section class="Result"><section>' + $(this).text() + '</section><section>' + (function(queryResult) {
							var resultSeasoning = function(queryResult) {
								if(queryResult == null || queryResult == undefined) {
									queryResult = '<span class="Empty">' + queryResult + '</span>';
								} else if(typeof queryResult == 'function' || typeof queryResult == 'boolean') {
									queryResult = '<span>' + queryResult + '</span>';
								} else if(typeof queryResult == 'string') {
									queryResult = '<span>"<span class="String">' + queryResult + '</span>"</span>';
								}  else if(typeof queryResult == 'object' && typeof queryResult.length == 'number') {
									var tempResult = '<span>[';
									
									for(var Loop = 0; Loop < queryResult.length; Loop++) {
										tempResult += resultSeasoning(queryResult[Loop]) + (Loop < queryResult.length - 1 ? ', ' : '');
									}
									
									queryResult = tempResult + ']</span>';
								} else {
									queryResult = '<span class="Normal">' + queryResult + '</span>';
								}
								
								return queryResult;
							};
							
							if(isError) {
								queryResult = '<span class="Error">' + errorObject + '</span>';
							} else {
								queryResult = resultSeasoning(queryResult);
							}
							
							return queryResult;
						})(queryResult) + '</section></section>').get(0));
						$(this).html('');
					}
				});
				
				Cufon.replace('#Dialog *, #Shell *, #Decrypt *', {
					fontFamily: 'Microsoft Neogothic'
				});
			}
			
			$('#Slides').html('');
			
			Titanium.Thread.Register(Titanium.Thread.contextMenuKiller);
			
			// Validate the value that has been encrypted.
			if(Titanium.contextData[contextId].isProtected) {
				if(!protectKey) {
					$('body').addClass('Decrypt');
					
					$('#Initializer').hide();
					$('#Titanium').show();
					$('#Decrypt').fadeIn();
					
					return null;
				} else {
					var tmpData = CryptoJS.AES.decrypt(slideData, protectKey).toString(), decryptedCode = '';
					
					for(var Loop = 0; Loop < tmpData.length / 2; Loop++) {
						decryptedCode += String.fromCharCode(parseInt(tmpData.substr(Loop * 2, 2), 16));
					}
					
					try {
						Titanium.contextData[contextId].slideData = eval(unescape(decryptedCode));
						
						slideData = Titanium.contextData[contextId].slideData;
					} catch(exceptionObj) {
						return null;
					}
				}
			}
			
			slideData.push(
				Titanium.Slide({
					Background: 'rgba(0, 0, 0, 0.9)',
					transitionEffect: 'fadein',
					objectList: [
						$(Titanium.Slide.Object.textBox('doneMsg', 'Quite Easily Done.', {
							width: '200px',
							height: '50px',
							margin: '-25px 0 0 -100px',
							top: '50%',
							left: '50%',
							textAlign: 'center',
							fontSize: '12pt',
							lineHeight: '50px',
							color: 'rgb(255, 255, 255)'
						})).addClass('NeoGothic').get(0)
					]
				})
			);
			
			// Print out.
			for(var Loop = 0; Loop < slideData.length; Loop++) {
				var slideContainer = $('<section></section>').get(0);
				$('#Slides').get(0).appendChild(slideContainer);
				
				if(slideData[Loop].Background) { 
					$(slideContainer).css({
						background: slideData[Loop].Background,
						backgroundSize: 'cover'
					});
				}
				
				for(var subLoop = 0; subLoop < slideData[Loop].objectList.length; subLoop++) {
					if(slideData[Loop].objectList[subLoop] != null) {
						slideContainer.appendChild(slideData[Loop].objectList[subLoop]);
					}
				}
				
				$(slideContainer).click(function() {
					Titanium.slideFlip('next');
				});
				
				Titanium.eventHistory[Loop] = [];
			}
			
			Cufon.replace('#Slides .NeoGothic', {
				fontFamily: 'Microsoft Neogothic'
			});
			
			$(document).ready(function() {
				$(window).resize(function() {
					location.reload();
				});
				
				if(Titanium.logoDisplay) {
					$('#Initializer').show();
				}
				
				$('#Titanium').fadeIn('slow', function() {
					if(Titanium.logoDisplay) {
						$('#Initializer').delay(500).fadeOut('slow', function() {
							$('#Slides > section').eq(0).show('fast', Titanium.contextData[Titanium.targetId].slideData[0].entranceEffect || function() {});
						});
						
						Titanium.logoDisplay = false;
					} else {
						$('#Slides > section').eq(0).show('fast', Titanium.contextData[Titanium.targetId].slideData[0].entranceEffect || function() {});
					}
						
					$('#Navigations > section:last-child section').width(parseInt($(window).width()) / (slideData.length - 1));
				}).mousemove(function(Event) {
					Titanium.Thread.resourceList.Cursor = {
						X: Event.pageX,
						Y: Event.pageY
					};
				});
				
				$(this).keydown(function(Event) {
					if($('#Dialog').css('display') == 'none' && $('#Shell').css('display') == 'none') {
						if(Event.keyCode == 37) {
							Titanium.slideFlip('prev');
						} else if(Event.keyCode == 39) {
							Titanium.slideFlip('next');
						}
					}
				});
				
				Titanium.Thread.Register(Titanium.Thread.cursorEnabler);
			});
		};
		
		this.slideFlip = function(targetIdx) {
			var targetMethod = targetIdx, eventQueue = Titanium.contextData[Titanium.targetId].slideData[Titanium.slideIndex].eventQueue;
			
			targetIdx = targetIdx == 'prev' ? Titanium.slideIndex - 1 : (targetIdx == 'next' ? Titanium.slideIndex + 1 : targetIdx);
			targetIdx = targetIdx < 0 ? 0 : (targetIdx > Titanium.contextData[Titanium.targetId].slideData.length ? Titanium.contextData[Titanium.targetId].slideData.length : targetIdx);
			
			if(!$('#Slides > section').eq(Titanium.slideIndex).attr('titanium:event')) {
				$('#Slides > section').eq(Titanium.slideIndex).attr('titanium:event', 0);
			} else {
				Titanium.eventIndex = $('#Slides > section').eq(Titanium.slideIndex).attr('titanium:event');
			}
			
			if(typeof eventQueue == 'object' && eventQueue.length && typeof targetMethod != 'number') {
				if(targetMethod == 'next' && Titanium.eventIndex < eventQueue.length && $('#Slides > section').eq(Titanium.slideIndex).attr('titanium:event') < eventQueue.length) {
					Titanium.eventHistory[Titanium.slideIndex].push($('#Slides > section').eq(Titanium.slideIndex).get(0).cloneNode(true));
					
					try {
						if(typeof eventQueue[Titanium.eventIndex] == 'function') {
							eventQueue[Titanium.eventIndex++]();
						}
					}
					catch(Exception) {
						Titanium.Control.Shell.Show();
						
						Titanium.Shell.Log('Critical error occurred in process to slide event(detail address is <span style="font-style: italic; color: rgb(0, 0, 0)">Titanium.contextData.' + Titanium.targetId + '.slideData[' + Titanium.slideIndex.toString() + '].eventQueue[' + (Titanium.eventIndex - 1).toString() + ']</span>). debug it or jump to other slide.', true, true);
						Titanium.Shell.Log(Titanium.contextData[Titanium.targetId].slideData[Titanium.slideIndex].eventQueue[Titanium.eventIndex - 1], false);
						Titanium.Shell.Log(Exception, false, true);
						
						return false;
					}
					
					$('#Slides > section').eq(Titanium.slideIndex).attr('titanium:event', Titanium.eventIndex);
					
					return;
				} else if(targetMethod == 'prev' && Titanium.eventHistory[Titanium.slideIndex].length) {
					$('#Slides').get(0).replaceChild(Titanium.eventHistory[Titanium.slideIndex].pop(), $('#Slides > section').eq(Titanium.slideIndex).get(0));
					$('#Slides > section').eq(Titanium.slideIndex).find('cufon').each(function() {
						$(this).parent().get(0).appendChild(document.createTextNode($(this).find('cufontext').text()))
					}).remove();
					$('#Slides > section').eq(Titanium.slideIndex).each(function() {
						Cufon.replace('#Slides > section:nth-child(' + (Titanium.slideIndex + 1) + ') .NeoGothic', {
							fontFamily: 'Microsoft Neogothic'
						});
					}).click(function() {
						Titanium.slideFlip('next');
					});
					
					Titanium.eventIndex--;
					
					return;
				}
			}
			
			if(targetIdx != Titanium.slideIndex && Titanium.contextData[Titanium.targetId].slideData[targetIdx]) {
				var lookingSlide = $('#Slides > section').eq(Titanium.slideIndex), nextSlide = $('#Slides > section').eq(targetIdx), transitionEffect = Titanium.contextData[Titanium.targetId].slideData[targetIdx].transitionEffect, entranceEffect = Titanium.contextData[Titanium.targetId].slideData[targetIdx].entranceEffect || function() {};
				
				if(!transitionEffect || targetIdx < Titanium.slideIndex) {
					lookingSlide.hide();
					nextSlide.show();
				} else if(transitionEffect == 'smooth') {
					lookingSlide.fadeOut('slow');
					nextSlide.fadeIn('slow', entranceEffect);
				} else if(transitionEffect == 'fadein') {
					nextSlide.fadeIn('slow', entranceEffect);
				}
				
				$('#Navigations > section:last-child section').width(parseInt($(window).width()) / (Titanium.contextData[Titanium.targetId].slideData.length - 1) * (targetIdx + 1));
				
				Titanium.slideIndex = targetIdx;
				Titanium.eventIndex = 0;
			}
		};
		
		this.Reload = function() {
			$('body').html('');
			eval(Titanium.originHtml);
		}
	};
	
	Titanium.Shell = new function() {
		this.Clear = function() {
			$('#Shell > section > section:nth-child(2) > section:first-child').html('');
			Titanium.Shell.Log('Titanium : Hypertext presentation rendering framework.\nCopyright ' + (new Date()).getFullYear().toString() + ' Heaven laboratory. All rights reserved.');
		};
		
		this.Log = function(logString, isHtml, isError) {
			$('#Shell > section > section:nth-child(2) > section:first-child').get(0).appendChild((function(logString, isHtml, isError) {
				var logObject = $('<section class="Log"></section>').get(0);
				logObject.appendChild(isHtml ? $('<span>' + logString + '</span>').get(0) : document.createTextNode(logString));
				
				if(isError) {
					$(logObject).css({
						color: 'rgb(255, 0, 0)'
					});
				}
				
				return logObject;
			})(logString, isHtml, isError));
		};
		
		this.Analysis = function(targetObject, navDepth) {
			try {
				if(!navDepth) {
					navDepth = 0;
				}
				
				if(navDepth == -1) {
					for(var Loop = 0; Loop < targetObject.length; Loop++) {
						if(typeof targetObject[Loop].length == 'number') {
							Titanium.Shell.Analysis(targetObject[Loop], -1);
						} else {
							var depthPrefix = (function(Depth, Origin, Iterator) {
								var targetString = ''
								
								for(var subLoop = 0; subLoop < Depth; subLoop++) {
									targetString += '  ';
								}
								
								return targetString;
							})(targetObject[Loop].Depth, targetObject, Loop), itemType = targetObject[Loop].Type, Content = targetObject[Loop].Content, itemContent = '';
							
							if(itemType == 'string') {
								itemContent = '("' + (Content.length > 25 ? Content.substr(0, 25) + '...' : Content).split('\n').join('↵') + '")';
							} else if(itemType == 'boolean' || itemType == 'number') {
								itemContent = '(' + Content.toString() + ')';
							} else if(itemType == 'object' && Content.constructor.name) {
								itemContent = '(' + Content.constructor.name + ')';
							}
							
							console.log(depthPrefix + targetObject[Loop].Name + ' : ' + itemType + itemContent);
							Titanium.Shell.Log(depthPrefix + targetObject[Loop].Name + ' : ' + itemType + itemContent);
						}
					}
				} else if(typeof targetObject == 'object' && navDepth < 20) {
					var treeObject = [];
					
					for(var Item in targetObject) {
						var itemType = typeof targetObject[Item];
						
						if(itemType == 'object') {
							if(targetObject[Item] instanceof Array) {
								itemType = 'array';
							} else if(targetObject[Item] == null) {
								itemType = 'null';
							}
						}
						
						treeObject.push({
							Name: Item,
							Type: itemType,
							Content: targetObject[Item],
							Depth: navDepth
						});
						
						if(typeof targetObject[Item] == 'object' && !(targetObject[Item] instanceof Node) && targetObject[Item] != targetObject) {
							treeObject.push(Titanium.Shell.Analysis(targetObject[Item], navDepth + 1));
						}
					}
					
					if(!navDepth) {
						Titanium.Shell.Analysis(treeObject, -1);
					} else {
						return treeObject;
					}
				}
			} catch(Exception) {
				Titanium.Shell.Log('[Force stoped by error counter]');
			}
		};
		
		this.Help = function() {
			Titanium.Shell.Log('Guide of titanium interactive data modification tool.\n\nHelp\t\t\t\t\t\tShow this explanation.\nLog\t\t\t\t\t\t\tOutput what you written.\nClear\t\t\t\t\tClear console\nAnalysis\t\tAnalysis object.');
		};
	}
	
	Titanium.Slide = function(slideObj) {
		return new (function(slideObj) {
			this.masterSlide = slideObj.masterSlide;
			this.transitionEffect = slideObj.transitionEffect;
			this.entranceEffect = slideObj.entranceEffect;
			this.Background = slideObj.Background;
			this.objectList = slideObj.objectList;
			this.eventQueue = slideObj.eventQueue;
		})(slideObj);
	};
	
	Titanium.Slide.Master = function(slideObj) {
		return new (function(slideObj) {
			this.Background = slideObj.Background;
			this.objectList = slideObj.objectList;
		})(slideObj);
	};
	
	Titanium.Slide.Object = new function() {
		this.Polygon = function(axisMatrix, vertexMatrix, foreColor) {
			if(vertexMatrix.length <= 2) {
				return null;
			}
			
			for(var Loop = 0; Loop < vertexMatrix.length; Loop++) {
				for(var subLoop = 0; subLoop < 2; subLoop++) {
					if(typeof vertexMatrix[Loop][subLoop] == 'string' && vertexMatrix[Loop][subLoop].substr(-1, 1) == '%') {
						vertexMatrix[Loop][subLoop] = parseInt(subLoop == 0 ? $(window).width() : $(window).height()) * (parseInt(vertexMatrix[Loop][subLoop]) / 100);
					}
				}
			}
			
			var minX, maxX, minY, maxY, vertexWidth, vertexHeight;
			
			for(var Loop = 0; Loop < vertexMatrix.length; Loop++) {
				minX = minX == undefined || minX > vertexMatrix[Loop][0] ? vertexMatrix[Loop][0] : minX;
				maxX = maxX == undefined || maxX < vertexMatrix[Loop][0] ? vertexMatrix[Loop][0] : maxX;
				minY = minY == undefined || minY > vertexMatrix[Loop][1] ? vertexMatrix[Loop][1] : minY;
				maxY = maxY == undefined || maxY < vertexMatrix[Loop][1] ? vertexMatrix[Loop][1] : maxY;
			}
			
			vertexWidth = maxX - minX;
			vertexHeight = maxY - minY;
			
			for(var Loop = 0; Loop < 2; Loop++) {
				if(typeof axisMatrix[Loop] == 'string' && axisMatrix[Loop].substr(-1, 1) == '%') {
					axisMatrix[Loop] = Math.round((parseInt(Loop == 0 ? $(window).width() : $(window).height()) - (Loop == 0 ? vertexWidth : vertexHeight)) / 2);
				} else if(axisMatrix[Loop] < 0) {
					axisMatrix[Loop] = parseInt(Loop == 0 ? $(window).width() : $(window).height()) - (Loop == 0 ? vertexWidth : vertexHeight) + axisMatrix[Loop];
				}
			}
			
			var canvasObj = (function() {
				var canvasObj = document.createElement('canvas');
				canvasObj.width = $(window).width();
				canvasObj.height = $(window).height();
				
				return canvasObj;
			})(), canvasCtx = canvasObj.getContext('2d');
			foreColor = (function(foreColor) {
				foreColor = foreColor.toString(16);
				
				while(foreColor.length < 8) {
					foreColor = '0' + foreColor;
				}
				
				return foreColor;
			})(foreColor);
			canvasCtx.fillStyle = 'rgba(' + parseInt('0x' + foreColor.substr(2, 2)) + ', ' + parseInt('0x' + foreColor.substr(4, 2)) + ', ' + parseInt('0x' + foreColor.substr(6, 2)) + ', ' + (parseInt('0x' + foreColor.substr(0, 2)) / 255) + ')';
			
			canvasCtx.translate(axisMatrix[0], axisMatrix[1]);
			canvasCtx.beginPath();
			canvasCtx.moveTo(vertexMatrix[0][0], vertexMatrix[0][1]);
			
			for(var Loop = 1; Loop < vertexMatrix.length; Loop++) {
				canvasCtx.lineTo(vertexMatrix[Loop][0], vertexMatrix[Loop][1]);
			}
			
			canvasCtx.closePath();
			canvasCtx.fill();
			
			return canvasObj;
		};
		
		this.Canvas = function(Width, Height, Styles) {
			var canvasObject = document.createElement('canvas');
			
			canvasObject.width = Width;
			canvasObject.height = Height;
			
			$(canvasObject).css(Styles);
			
			return canvasObject;
		};
		
		this.Image = function(axisMatrix, fileAddr) {
			var imgObj = (function(fileAddr) {
				var imgObj = document.createElement('img');
				imgObj.src = fileAddr;
				
				return imgObj;
			})(fileAddr);
			
			$(imgObj).on('load', function() {
				for(var Loop = 0; Loop < 2; Loop++) {
					if(typeof axisMatrix[Loop] == 'string' && axisMatrix[Loop].substr(-1, 1) == '%') {
						axisMatrix[Loop] = Math.round((parseInt(Loop == 0 ? $(window).width() : $(window).height()) - (Loop == 0 ? parseInt($(imgObj).width()) : parseInt($(imgObj).height()))) / 2);
					} else if(axisMatrix[Loop] < 0) {
						axisMatrix[Loop] = parseInt(Loop == 0 ? $(window).width() : $(window).height()) - (Loop == 0 ? imgObj.width : imgObj.height) + axisMatrix[Loop];
					}
				}
				
				$(imgObj).css({
					top: axisMatrix[1],
					left: axisMatrix[0]
				});
			});
			
			return imgObj;
		};
		
		this.Native = function(Id, Styles, Children) {
			var targetObject = document.createElement('section');
			
			if(Id != null) {
				targetObject.id = Id;
			}
			
			if(typeof Styles == 'object') {
				$(targetObject).css(Styles);
			}
			
			if(typeof Children == 'object' && Children.length) {
				for(var Loop = 0; Loop < Children.length; Loop++) {
					targetObject.appendChild(Children[Loop]);
				}
			}
			
			return targetObject;
		}
		
		this.Text = function(Text) {
			var targetObject = document.createElement('span');
			targetObject.innerHTML = Text;
			
			return targetObject;
		}
		
		this.textBox = function(Id, Text, Styles) {
			return this.Native(Id, Styles || {}, [this.Text(Text)]);
		}
	};
	
	Titanium.Thread = new function() {
		this.workList = [];
		this.resourceList = {};
		
		this.Register = function(threadFunc, Interval) {
			this.workList.push(setInterval(threadFunc, Interval || 10));
			
			return this.workList.length - 1;
		};
		
		this.Destroy = function(threadIndex) {
			if(this.workList[threadIndex]) {
				clearInterval(this.workList[threadIndex]);
				
				if(this.workList[threadIndex] === this.workList[this.workList.length - 1]) {
					this.workList.pop();
				} else {
					this.workList[threadIndex] = undefined;
				}
			}
		};
		
		this.cursorEnabler = function() {
			var resourceList = Titanium.Thread.resourceList;
			
			if(resourceList.Cursor) {
				var X = resourceList.Cursor.X, Y = resourceList.Cursor.Y, prevCursor = resourceList.prevCursor;
				
				if(prevCursor) {
					if(Math.abs(prevCursor.X - X) / $(window).width() * 100 >= 5 || Math.abs(prevCursor.Y - Y) / $(window).width() * 100 >= 5) {
						$('#Titanium').css({
							cursor: 'default'
						});
					} else {
						if(X == prevCursor.X && Y == prevCursor.Y) {
							if((function() {
								if(!Titanium.Thread.resourceList.cursorCount) {
									Titanium.Thread.resourceList.cursorCount = 0;
								}
								
								return Titanium.Thread.resourceList.cursorCount++;
							})() >= 250) {
								Titanium.Thread.resourceList.cursorCount = 0;
								
								$('#Titanium').css({
									cursor: 'none'
								});
							}
						}
					}
				}
				
				Titanium.Thread.resourceList.prevCursor = {
					X: X,
					Y: Y
				};
			}
		};
		
		this.contextMenuKiller = function() {
			$(document).on('contextmenu', function() {
				return false;
			});
		}
	};
	
	Titanium.Control = new function() {
		this.Dialog = new function() {
			this.Show = function(dialogTitle, contextMsg, Width, Height, interfaceType, okayFx) {
				$('#Dialog > section h1').html(dialogTitle);
				$('#Dialog > section p').html(contextMsg);
				
				Cufon.replace('#Dialog *', {
					fontFamily: 'Microsoft Neogothic'
				});
				
				$('#Dialog').fadeIn();
				$('#Dialog > section').css({
					width: Width,
					height: Height,
					marginTop: parseInt(Height) / -2,
					marginLeft: parseInt(Width) / -2,
					top: '50%'
				}).css({
					top: parseInt($('#Dialog > section').css('top')) * 1.125
				}).animate({
					top: '50%',
					opacity: 1
				}, {
					queue: false,
					duration: 375
				});
				
				$('#Dialog > section button').eq(1).click(okayFx);
			}
		};
		
		this.Shell = new function() {
			this.Show = function() {
				$('#Shell > section > section:nth-child(2) > section:first-child').html('');
				Titanium.Shell.Log('Titanium : Hypertext presentation rendering framework.\nCopyright ' + (new Date()).getFullYear().toString() + ' Heaven laboratory. All rights reserved.');
				
				$('#Shell').fadeIn();
				$('#Shell > section').css({
					top: parseInt($('#Shell > section').css('top')) * 1.125
				}).animate({
					top: '50%',
					opacity: 1
				}, {
					queue: false,
					duration: 375
				});
				
				$('#Shell > section > section:nth-child(2)').click();
			}
		};
		
		this.Slide = new function() {
			this.prevFlip = function() {
				Titanium.slideFlip('prev');
			};
			
			this.nextFlip = function() {
				Titanium.slideFlip('next');
			};
		};
	};
	
	window.Titanium = Titanium;
})();