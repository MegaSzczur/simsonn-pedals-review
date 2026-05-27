document.addEventListener('DOMContentLoaded', () => {
  // Elements - Calculator
  const currentPedals = document.getElementById('currentPedals');
  const lapTime = document.getElementById('lapTime');
  const timeSaved = document.getElementById('timeSaved');
  const progressVal = document.getElementById('progressVal');
  const progressBar = document.getElementById('progressBar');
  const progressDesc = document.getElementById('progressDesc');

  // Elements - Copy Coupon
  const copyBtn = document.getElementById('copyBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const copyToast = document.getElementById('copyToast');
  const couponCode = document.getElementById('couponCode');

  // Elements - Advisor
  const rigButtons = document.querySelectorAll('.rig-btn');
  const advisorResult = document.getElementById('advisorResult');

  // --- 1. CALCULATOR LOGIC ---
  // Realistic estimates based on community data from iRacing forums and simracing coach reports.
  // Load-cell typically saves 0.3–0.8s per lap vs potentiometer pedals on technical tracks.
  // The savings come purely from more consistent brake application.
  const pedalMetrics = {
    logitech:         { savedPer100s: 0.55, desc: 'zwykłą sprężyną (Logitech G29/G920/G293)' },
    thrustmaster:     { savedPer100s: 0.45, desc: 'sprzężynowymi pedałami Thrustmaster T3PA / T3PA-Pro (potencjometr)' },
    moza_fanatec_pot: { savedPer100s: 0.35, desc: 'pedałami Moza SRP Lite lub Fanatec CSL (bez load-cell)' },
    tlcm:             { savedPer100s: 0.12, desc: 'Thrustmaster T-LCM (load-cell na hamulcu, potencjometry na gazie/sprzęgle)' },
    loadcell_other:   { savedPer100s: 0.10, desc: 'innym zestawem load-cell (Fanatec CSL LC, Heusinkveld itp.)' },
    generic:          { savedPer100s: 0.50, desc: 'podstawowymi pedałami potencjometrowymi' }
  };

  function updateCalculator() {
    const selected = currentPedals.value;
    const time = parseFloat(lapTime.value) || 95;
    const metrics = pedalMetrics[selected] || pedalMetrics.generic;

    // Scale time saved proportionally to lap length
    const saved = (time / 100) * metrics.savedPer100s;
    timeSaved.textContent = `-${saved.toFixed(2)}s`;

    // Show a realistic consistency bar without inflated %
    // The bar represents "brake application consistency" — not a precise scientific measure.
    const barWidth = selected === 'loadcell_other' ? 82
      : selected === 'tlcm'             ? 80
      : selected === 'moza_fanatec_pot' ? 62
      : selected === 'thrustmaster'     ? 55
      : selected === 'logitech'         ? 48
      : 50;
    const simsonWidth = 88;

    progressVal.innerHTML = `Twoje pedały: <strong style="color:var(--text-muted)">${barWidth}%</strong> → SIMSONN: <strong style="color:var(--primary)">${simsonWidth}%</strong>`;
    progressBar.style.width = `${simsonWidth}%`;

    if (selected === 'loadcell_other' || selected === 'tlcm') {
      const isTlcm = selected === 'tlcm';
      progressDesc.innerHTML = isTlcm
        ? `T-LCM mają load-cell na hamulcu — to dobry punkt startowy. Różnica względem SIMSONN będzie niewielka. Główne argumenty za zmianą to <strong>lepsza jakość wykonania</strong> (stal vs. plastik), czujniki Halla na gazie i sprzęgle (T-LCM używa potencjometrów na gazie/sprzęgle) oraz opcjonalna haptyka VAM.`
        : `Z pedałami load-cell (inny producent) już masz solidną bazę. Przejście na SIMSONN da mniejszą poprawę, głównie dzięki lepszej modułowości i haptyce. Różnica w czasach będzie minimalna.`;
    } else if (selected === 'moza_fanatec_pot') {
      progressDesc.innerHTML = `Moza SRP Lite i Fanatec CSL Pedals (bez LC) to <strong>wyraźnie lepsze</strong> pedały niż Logitech czy T3PA — mają lepszą budowę mechaniczną i często twardszy koniec skoku. Jednak wciąż mierzą <strong>dystans ruchu stopy</strong> (potencjometr), nie siłę. Przy agresywnym hamowaniu ‐00% hamowania” zależy od pełnego wciśnięcia, a nie od realnej siły — co utrudnia powtarzalną technikę trail-brakingu.`;
    } else {
      progressDesc.innerHTML = `Pedały z <strong>${metrics.desc}</strong> mają zmienną charakterystykę siły — przez co trudno wyrobić powtarzalny punkt dohamowywania. SIMSONN Load-Cell mierzy rzeczywisty nacisk stopy, co daje bardziej stabilną charakterystykę przy każdym okrążeniu.`;
    }
  }

  // Event Listeners for Calculator
  currentPedals.addEventListener('change', updateCalculator);
  lapTime.addEventListener('input', updateCalculator);

  // Initial run
  updateCalculator();

  // --- 2. ADVISOR TAB LOGIC ---
  // Removed absurd % badges. Each advice always includes the cockpit requirement warning.
  const advisorContent = {
    desk_logitech: {
      badge: '⚠️ KROK 1: KONIECZNY SOLIDNY STOJAK',
      badgeClass: 'warning',
      title: 'Najpierw stojak — potem pedały SIMSONN',
      text: `<strong style="color:var(--primary)">Ważna informacja:</strong> Pedały SIMSONN wymagają montażu do stałej podstawy — śrubami lub zaciskami do profili aluminiowych. Nie da się ich używać na biurku ani na zwykłym krześle, bo przy nacisku 30–80 kg pedał hamulca, całe krzesło by się odsunęło. <br><br>
      <strong>Kolejność zakupów:</strong><br>
      1️⃣ Solidny Wheelstand (np. Playseat Challenge, Next Level F-GT, GT Omega Apex) lub aluminiowy kokpit<br>
      2️⃣ Dopiero wtedy pedały SIMSONN Load-Cell<br><br>
      Po zamontowaniu pedałów na stojaku zysk jest realny — koniec z blokowaniem kół w momentach silnego hamowania, lepsza kontrola Trail Brakingu.`,
      link: 'https://www.simsonn.com/?ref=simracing'
    },
    stand_any: {
      badge: '✅ MASZ STOJAK — JESTEŚ GOTOWY',
      badgeClass: 'success',
      title: 'Pedały SIMSONN to Twój naturalny następny krok',
      text: `Stojak lub kokpit to absolutny warunek dla tych pedałów — i już go masz, świetnie! Fabryczne pedały sprężynowe (niezależnie od marki kierownicy) opierają się na dystansie ruchu stopy. Twój mózg nie potrafi powtarzalnie kontrolować kąta zgięcia stopy przy dużym nacisku na hamulec.<br><br>
      SIMSONN mierzy <strong>siłę nacisku w kilogramach</strong> — pamięć mięśniowa ręki/nogi uczy się siły znacznie szybciej niż pozycji. W praktyce oznacza to bardziej stabilne czasy okrążeń i mniej błędów w strefach hamowania przy końcowych prostych.<br><br>
      Zacznij od kompletnego zestawu <strong>Plus X Hydraulic Pedal Set ($271.90)</strong> i ewentualnie dokup moduł haptyczny VAM później.`,
      link: 'https://www.simsonn.com/products/simsonn-plus-x-load-cell-pedal-set?ref=simracing'
    },
    dd_basic: {
      badge: '⚠️ SPRAWDŹ CZY PEDAŁY SĄ ZAMONTOWANE',
      badgeClass: 'warning',
      title: 'Kierownica DD + zwykłe pedały = niedobrane ogniwa',
      text: `Kierownica Direct Drive daje duży zysk w czuciu auta i pozwala wcześniej wyczuć utratę przyczepności. Jednak precyzja hamowania wciąż zależy od pedałów. Jeśli masz stojak lub kokpit i fabryczne sprężynowe pedały — pedały SIMSONN to kolejny logiczny krok.<br><br>
      <strong style="color:var(--primary)">Pamiętaj:</strong> Pedały SIMSONN wymagają sztywnego montażu do podstawy. Jeżeli grasz na fotelu gamingowym lub biurku i trzymasz pedały nogą o biurko — najpierw zainwestuj w Wheelstand.<br><br>
      Po zamontowaniu: połączenie DD + Load-Cell to już prawdziwa precyzja — możesz skupić się na technice, a nie walczyć ze sprzętem.`,
      link: 'https://www.simsonn.com/?ref=simracing'
    }
  };

  rigButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      rigButtons.forEach(b => b.classList.remove('active'));

      // Add active to clicked
      btn.classList.add('active');

      const rigType = btn.getAttribute('data-rig');
      const data = advisorContent[rigType];

      if (data) {
        // Fade out transition
        advisorResult.style.opacity = 0;
        advisorResult.style.transform = 'translateY(8px)';

        setTimeout(() => {
          const badgeColor = data.badgeClass === 'warning'
            ? 'background: rgba(255, 180, 0, 0.1); border-color: rgba(255, 180, 0, 0.3); color: #ffb400;'
            : 'background: rgba(0, 230, 118, 0.08); border-color: rgba(0, 230, 118, 0.2); color: var(--highlight-green);';

          advisorResult.innerHTML = `
            <div class="result-badge" style="${badgeColor}">${data.badge}</div>
            <h3>${data.title}</h3>
            <p style="line-height: 1.8">${data.text}</p>
            <div class="result-actions">
              <a href="${data.link}" target="_blank" class="btn-primary">Sprawdź pedały SIMSONN</a>
            </div>
          `;

          // Fade in transition
          advisorResult.style.opacity = 1;
          advisorResult.style.transform = 'translateY(0)';
        }, 150);
      }
    });
  });

  // --- 3. COPY COUPON LOGIC ---
  copyBtn.addEventListener('click', () => {
    const codeText = couponCode.textContent.trim();

    // Write code to clipboard
    navigator.clipboard.writeText(codeText).then(() => {
      // Trigger toast
      copyToast.classList.add('show');

      // Update button text
      copyBtnText.textContent = 'SKOPIOWANO!';
      copyBtn.style.background = 'var(--highlight-green)';

      // Reset toast and button text after 3 seconds
      setTimeout(() => {
        copyToast.classList.remove('show');
        copyBtnText.textContent = 'SKOPIUJ KOD';
        copyBtn.style.background = 'var(--primary)';
      }, 3000);
    }).catch(err => {
      console.error('Błąd podczas kopiowania kuponu:', err);
    });
  });
});
