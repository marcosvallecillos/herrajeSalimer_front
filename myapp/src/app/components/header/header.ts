import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {
  isSpanish: boolean = true;
  isMenuOpen: boolean = false;
  isScrolled: boolean = false;
  
  private scrollListener: () => void;
  private progressBar: HTMLElement | null = null;

  constructor(
    private languageService: LanguageService,
    private router: Router
  ) {
    this.scrollListener = this.handleScroll.bind(this);
    
    // Suscribirse al servicio de idioma
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );
  }

  ngOnInit(): void {
    this.initializeHeader();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.handleScroll();
  }
    toggleLanguage(language: 'es' | 'en') {
    this.languageService.setLanguage(language);
    localStorage.setItem('language', language);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isMenuOpen && window.innerWidth > 768) {
      this.closeMenu();
    }
  }

  /**
   * Inicializa el header y sus componentes
   */
  private initializeHeader(): void {
    this.setupProgressBar();
    this.setupScrollListener();
  }

  /**
   * Configura el listener de scroll
   */
  private setupScrollListener(): void {
    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  /**
   * Maneja el evento de scroll
   */
  private handleScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const wasScrolled = this.isScrolled;
    
    this.isScrolled = scrollTop > 50;
    
    // Solo actualizar si el estado cambió
    if (wasScrolled !== this.isScrolled) {
      this.updateHeaderAppearance();
    }
    
    this.updateProgressBar();
  }

  /**
   * Actualiza la apariencia del header según el scroll
   */
  private updateHeaderAppearance(): void {
    const header = document.querySelector('.header') as HTMLElement;
    if (header) {
      header.classList.toggle('scrolled', this.isScrolled);
    }
  }

  /**
   * Configura la barra de progreso
   */
  private setupProgressBar(): void {
    this.progressBar = document.getElementById('progressBar') as HTMLElement;
    
    if (!this.progressBar) {
      this.progressBar = document.createElement('div');
      this.progressBar.id = 'progressBar';
      this.progressBar.className = 'progress-indicator';
      document.body.appendChild(this.progressBar);
    }
  }

  /**
   * Actualiza la barra de progreso
   */
  private updateProgressBar(): void {
    if (!this.progressBar) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
    
    this.progressBar.style.width = `${scrollPercent}%`;
  }

  /**
   * Cambia el idioma
   */
  onLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const language = select.value as 'es' | 'en';
    
    this.languageService.setLanguage(language);
    localStorage.setItem('language', language);
  }

  /**
   * Obtiene el texto según el idioma actual
   */
  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  /**
   * Alterna el menú móvil
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Bloquear scroll del body cuando el menú está abierto
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    
    // Agregar/remover overlay
    if (this.isMenuOpen) {
      this.addMenuOverlay();
    } else {
      this.removeMenuOverlay();
    }
  }

  /**
   * Cierra el menú móvil
   */
  closeMenu(): void {
    if (this.isMenuOpen) {
      this.toggleMenu();
    }
  }

  /**
   * Agrega el overlay del menú móvil
   */
  private addMenuOverlay(): void {
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      z-index: 999;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    overlay.addEventListener('click', () => this.closeMenu());
    document.body.appendChild(overlay);
    
    // Animar overlay
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });
  }

  /**
   * Remueve el overlay del menú móvil
   */
  private removeMenuOverlay(): void {
    const overlay = document.querySelector('.menu-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  /**
   * Navega a una ruta con animación
   */
  navigateWithAnimation(route: string): void {
    this.closeMenu();
    
    const header = document.querySelector('.header') as HTMLElement;
    if (header) {
      header.style.transform = 'translateY(-100%)';
      header.style.transition = 'transform 0.3s ease';
      
      setTimeout(() => {
        this.router.navigate([route]);
        header.style.transform = '';
        header.style.transition = '';
      }, 300);
    } else {
      this.router.navigate([route]);
    }
  }

  /**
   * Limpia los event listeners y elementos
   */
  private cleanup(): void {
    window.removeEventListener('scroll', this.scrollListener);
    this.removeMenuOverlay();
    document.body.style.overflow = '';
    
    if (this.progressBar && this.progressBar.parentNode) {
      this.progressBar.parentNode.removeChild(this.progressBar);
    }
  }
}
