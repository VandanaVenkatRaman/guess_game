import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { FunctionalityService } from '../functionality.service';
import { MenuItem } from 'primeng/api';
import { confetti } from 'tsparticles-confetti';
import { tsParticles } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { loadConfettiPreset } from 'tsparticles-preset-confetti';
import { loadFireworksPreset } from 'tsparticles-preset-fireworks';
import { Router } from '@angular/router';

const containerMap = new Map();

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
  menuItems!: any[];

  activeItem: MenuItem | undefined;  
  confettiArray: any[] = [];
  @ViewChild('confettiCanvas', { static: true })
  confettiCanvas!: ElementRef;
  showConfetti = false;
  buzzerSounds = {
    "WrongAnswer": "/assets/sounds/Family-feud-buzzer-negative.mp3",
    "correctAnswer": "/assets/sounds/family-feud-good-answer.mp3",
    "clap":"/assets/sounds/audience-clapping.wav"
  }

  golfGifsBad = ['/assets/images_base/golf/golfbadpoint.gif', '/assets/images_base/golf/golfBad2.gif', '/assets/images_base/golf/golfBad3.gif']
  golfGifsGood = ['/assets/images_base/golf/goodGolf.gif', '/assets/images_base/golf/goodgolf2.gif', '/assets/images_base/golf/golfGood3.gif']


  golfImage = "";
  isGolf = false;
  isClapping = false;
  crossMark = false;
  duration = 6000;
  animationEnd : any;
  defaults: any;

  constructor(private functionalityService: FunctionalityService, private renderer: Renderer2, private el:ElementRef, private router: Router){
    this.menuItems = [
      { label: 'Menu 1', icon: 'pi pi-fw pi-home' },
      { label: 'Menu 2', icon: 'pi pi-fw pi-calendar' },
      { label: 'Menu 3', icon: 'pi pi-fw pi-user' },
    ];  
  }
    ngOnInit(){
      this.items = [
        { label: 'Bidding', target: '/bidding' },
        { label: 'Range',  target: '/range' },
        { label: 'Shopping',  target: '/shopping'  },
        { label: 'Golf',  target: '/golf' },
        { label: 'Mystery',  target: '/mystery' }
      ];

      //this.run();
      //this.fireworks()
      this.activeItem = this.items[0];

      this.functionalityService.aPopUpEvent.subscribe((x:any) => {
        if(x.action === 'wrong'){
          this.crossMark = true;
          this.functionalityService.playAudio(this.buzzerSounds.WrongAnswer);
          setTimeout((x:any)=> {this.crossMark = false}, 3000)
        }
        else if(x.action === 'right'){
          this.functionalityService.playAudio(this.buzzerSounds.clap);
          this.dollarsRain();
          //this.rainDollars()
        }
        else if(x.action === 'badGolf' || x.action === 'goodGolf'){
          this.golfType(x.action);
          //this.rainDollars()
        }
      })

      this.functionalityService.aClickedEvent.subscribe((x:any) => {
        if(x.action === 'claps'){
          this.clap();
          this.functionalityService.playAudio(this.buzzerSounds.clap);
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
    console.log(event);
    this.router.navigate([`/${event.target}`]); // Replace 'new-route' with the actual route path you want to navigate to.
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

      $('#container-id').addClass('zind');
      await loadFull(tsParticles);
    
      var container = await tsParticles.load('container-id',options);

      containerMap.set("container-id", container);

      debugger;

      
      const array = tsParticles['_domArray'];
      console.log(array);
      console.log(tsParticles);
      setTimeout(()=> {
        const containerToDestroy = containerMap.get("container-id");
        if (containerToDestroy) {
          $('#container-id').removeClass('zind');
          containerToDestroy.destroy();
          containerMap.delete("container-id");
        }
      }, 2000)

      //tsParticles['_domArray'].clearValues();
    }
    
    const baseEmitterConfig = (direction:any, position:any) => {
      return {
        direction,
        rate: {
          quantity: 100,
          delay: 0.4
        },
        size: {
          width: 50,
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
          duration: 0.7,
          delay: 0.2
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
          decay: 0.008
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
    setTimeout(()=> this.isClapping = false, 4000);
   }

   golfType(action: any){
    switch(action){
      case 'badGolf':
        this.golfImage = this.golfGifsBad[Math.floor(Math.random() * this.golfGifsBad.length)]
        break;
      case 'goodGolf':
        this.golfImage = this.golfGifsGood[Math.floor(Math.random() * this.golfGifsGood.length)]
        break;
    }
    this.isGolf = true;
    setTimeout(()=> this.isGolf = false, 4000);
   }
   onSpectrumClick(){
      window.localStorage.clear();
      this.router.navigate([''])
        .then(() => {
      window.location.reload();
      });
  }


   @HostListener('window:keyup', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event.key);
     if(event.key === ';'){
      this.crossMark = true;
          this.functionalityService.playAudio(this.buzzerSounds.WrongAnswer);
          setTimeout((x:any)=> {this.crossMark = false}, 3000)
    }
  }

}
