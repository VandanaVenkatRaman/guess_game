import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FunctionalityService } from '../functionality.service';
import { MenuItem } from 'primeng/api';
import { confetti } from 'tsparticles-confetti';
import { tsParticles } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { loadConfettiPreset } from 'tsparticles-preset-confetti';
import { loadFireworksPreset } from 'tsparticles-preset-fireworks';



@Component({
  selector: 'app-header',
  animations: [
    trigger("slideInOutLeft", [
      state("false", style({ transform: "scale(0)" })),
      state("true", style({ transform: "scale(1)" })),
      transition("false => true", animate("0.4s ease-out")),
      transition("true => false", animate("0.3s ease-in"))
    ]),
    trigger('confettiAnimation', [
      transition('* => *', [
        animate('10s', keyframes([
          style({ transform: 'translate3d(0,0,0)', offset: 0 }),
          style({ transform: 'translate3d(50vw,50vh,0)', offset: 0.5 }),
          style({ transform: 'translate3d(100vw,0,0)', offset: 1 })
        ]))
      ])
    ]),
    trigger('floatAnimation', [
      transition('* => *', [
        animate('5s', keyframes([
          style({ transform: 'translate3d(0,0,0)', offset: 0 }),
          style({ transform: 'translate3d(0, -200%, 0)', offset: 0.25 }),
          style({ transform: 'translate3d(0, -400%, 0)', offset: 0.5 }),
          style({ transform: 'translate3d(0, -600%, 0)', offset: 0.75 }),
          style({ transform: 'translate3d(0, -800%, 0)', offset: 1 })
        ]))
      ])
    ])
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  items: MenuItem[] | undefined;
  confettiArray: any[] = [];
  @ViewChild('confettiCanvas', { static: true })
  confettiCanvas!: ElementRef;
  showConfetti = false;
  bazarSounds = {
    "WrongLong": "/assets/sounds/Family-feud-buzzer-negative.mp3",
    "correctAnswer": "/assets/sounds/family-feud-good-answer.mp3"
  }

  isClapping = false;
  activeItem: MenuItem | undefined;
  crossMark = false;
  duration = 6000;
  animationEnd : any;
  defaults: any;
  constructor(private functionalityService: FunctionalityService, private renderer: Renderer2, private el:ElementRef){
  }



    ngOnInit(){
      this.items = [
        { label: 'Home', icon: 'pi pi-fw pi-home' },
        { label: 'Calendar', icon: 'pi pi-fw pi-calendar' },
        { label: 'Edit', icon: 'pi pi-fw pi-pencil' },
        { label: 'Documentation', icon: 'pi pi-fw pi-file' },
        { label: 'Settings', icon: 'pi pi-fw pi-cog' }
      ];

      //this.run();
      //this.fireworks()
      this.activeItem = this.items[0];

      this.functionalityService.aPopUpEvent.subscribe((x:any) => {
        if(x.action === 'wrong'){
          this.crossMark = true;
          this.functionalityService.playAudio(this.bazarSounds.WrongLong);
          setTimeout((x:any)=> {this.crossMark = false}, 1000)
        }
        else if(x.action === 'right'){
          this.functionalityService.playAudio(this.bazarSounds.correctAnswer);
          this.dollarsRain();
          //this.rainDollars()
        }
      })

      this.functionalityService.aClickedEvent.subscribe((x:any) => {
        if(x.action === 'claps'){
          this.clap();
        }
      })

      for (let i = 0; i < 50; i++) {
        this.confettiArray.push({
          left: Math.random() * 100 + 'vw',
          top: Math.random() * 100 + 'vh',
          animation: this.generateRandomAnimation()
        });
      }
  }

  ngAfterViewInit(){
  }

  generateRandomAnimation() {
    const duration = (Math.random() * 2 + 2) + 's'; // Random duration between 2s and 4s
    const delay = (Math.random() * 2) + 's'; // Random delay up to 2s
    const rotate = 'rotate(' + (Math.random() * 360) + 'deg)';
    const translateX = 'translateX(' + (Math.random() * 200 - 100) + 'vw)';
    const translateY = 'translateY(' + (Math.random() * 100 + 100) + 'vh)';
    
    return `confetti-fall ${duration} linear ${delay} both, ${rotate} ${duration} linear ${delay} both, ${translateX} ${duration} linear ${delay} both, ${translateY} ${duration} linear ${delay} both`;
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

  activateLast() {
    this.activeItem = (this.items as MenuItem[])[(this.items as MenuItem[]).length - 1];
  }

  run(){
    this.animationEnd = Date.now() + this.duration,
    this.defaults = { startVelocity: 30, spread: 360, ticks: 20, zIndex: 0 };

  function randomInRange(min:any, max:any) {
    return Math.random() * (max - min) + min;
  }

  const interval:any = setInterval(() => {
    const timeLeft = this.animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 20 * (timeLeft / this.duration);

    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, this.defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
    );
    confetti(
      Object.assign({}, this.defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    );
  }, 250);
  }
  async dollarsRain(){
    async function loadParticles(options:any) {
      await loadFull(tsParticles);
    
      await tsParticles.load(options);
    }
    
    const baseEmitterConfig = (direction:any, position:any) => {
      return {
        direction,
        rate: {
          quantity: 15,
          delay: 0.3
        },
        size: {
          width: 0,
          height: 0
        },
        spawnColor: {
          value: "#ff0000",
          animation: {
            h: {
              enable: true,
              offset: {
                min: -1.4,
                max: 1.4
              },
              speed: 2,
              sync: false
            },
            l: {
              enable: true,
              offset: {
                min: 40,
                max: 60
              },
              speed: 0,
              sync: false
            }
          }
        },
        life: {
          count: 3,
          duration: 0.2,
          delay: 0.4
        },
        position
      };
    };
    
    const configs = {
      background: {
      },
      particles: {
        angle: {
          value: 0,
          offset: 30
        },
        move: {
          enable: true,
          outModes: {
            top: "none",
            default: "destroy"
          },
          gravity: {
            enable: true
          },
          speed: { min: 5, max: 20 },
          decay: 0.01
        },
        number: {
          value: 0,
          limit: 300
        },
        opacity: {
          value: 1
        },
        shape: {
          type: ["circle", "square", "triangle"]
        },
        size: {
          value: { min: 2, max: 5 },
          animation: {
            count: 1,
            startValue: "min",
            enable: true,
            speed: 20,
            sync: true
          }
        },
        rotate: {
          value: {
            min: 0,
            max: 360
          },
          direction: "random",
          animation: {
            enable: true,
            speed: 60
          }
        },
        tilt: {
          direction: "random",
          enable: true,
          value: {
            min: 0,
            max: 360
          },
          animation: {
            enable: true,
            speed: 60
          }
        },
        roll: {
          darken: {
            enable: true,
            value: 25
          },
          enable: true,
          speed: {
            min: 15,
            max: 25
          }
        },
        wobble: {
          distance: 30,
          enable: true,
          speed: {
            min: -15,
            max: 15
          }
        }
      },
      emitters: [
        baseEmitterConfig("top-right", { x: 0, y: 40 }),
        baseEmitterConfig("top-left", { x: 100, y: 40 })
      ]
    };
    
    loadParticles(configs);
  }

  onClick(){
    this.dollarsRain();
  }

  async loadParticles(options:any) {
    await loadFireworksPreset(tsParticles);
  
    await tsParticles.load(options);
  }

  fireworks(){
    const configs = { preset: "fireworks" };

    this.loadParticles(configs);
  }


  async rainDollars(){
      await loadConfettiPreset(tsParticles);
      await tsParticles.load("tsparticles", {
        particles: {
          number: {
            value: 50, // Adjust the number of particles as needed
          },
          color: {
            value: "#00ff00", // Change color to match dollar notes
          },
          shape: {
            type: "image",
            image: {
              src: "/assets/range/car-2.jpg", // Replace with the image of a dollar note
              width: 100, // Adjust the width of the image
              height: 50, // Adjust the height of the image
            },
          },
          size: {
            value: 40,
            random: true,
            anim: {
              enable: false,
              speed: 4,
              size_min: 10,
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: 2,
            direction: "right", // Adjust the direction
            random: true,
            out_mode: "out",
            bounce: false,
          },
          line_linked: {
            enable: false,
          },
          interactivity: {
            events: {
              onhover: {
                enable: false,
              },
            },
          },
        },
        retina_detect: true,
      });
  }

  start() { // Randomly Execute Function
    const array = [0,1]
    debugger;
    const ranFunc = array[Math.floor(Math.random() * array.length)];
    if (ranFunc == 0) {
      console.log(ranFunc)
      this.rainDollars()
    }
    if (ranFunc == 1) {
      console.log(ranFunc)
     this.dollarsRain()
    }
   }

   clap(){
    this.isClapping = true;
    setTimeout(()=> this.isClapping = false, 3000);
   }

}
