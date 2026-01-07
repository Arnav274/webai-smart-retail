const defaultClasses = ['person', 'backpack', 'handbag', 'suitcase', 'bottle', 'cup', 'laptop', 'cell phone'];

export function renderClassFilters(container, filterSet) {
  container.innerHTML = '';
  defaultClasses.forEach(cls => {
    const pill = document.createElement('div');
    pill.className = 'pill';
    pill.textContent = cls;
    pill.addEventListener('click', () => {
      if (filterSet.has(cls)) {
        filterSet.delete(cls);
        pill.classList.remove('active');
      } else {
        filterSet.add(cls);
        pill.classList.add('active');
      }
    });
    container.appendChild(pill);
  });
}

export function renderLegend(listEl, colorMap) {
  listEl.innerHTML = '';
  colorMap.forEach((color, cls) => {
    const li = document.createElement('li');
    li.innerHTML = `<span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:${color};margin-right:6px;"></span>${cls}`;
    listEl.appendChild(li);
  });
}

export function renderCounts(listEl, detections) {
  const counts = new Map();
  detections.forEach(det => counts.set(det.class, (counts.get(det.class) || 0) + 1));
  listEl.innerHTML = '';
  counts.forEach((count, cls) => {
    const li = document.createElement('li');
    li.textContent = `${cls}: ${count}`;
    listEl.appendChild(li);
  });
  if (!counts.size) {
    const li = document.createElement('li');
    li.textContent = 'No detections yet';
    listEl.appendChild(li);
  }
}

export function setMessage(el, text) {
  el.textContent = text;
}
