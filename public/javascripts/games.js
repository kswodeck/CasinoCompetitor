function outOfCoinsDialog() {
  const outOfCoinsDialog = document.getElementById('outOfCoinsDialog');
  if (typeof outOfCoinsDialog.showModal === 'function') {
    outOfCoinsDialog.showModal();
    if (document.getElementsByClassName('backdrop')[0]) {
      outOfCoinsDialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
    }
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('outOfCoinsCancel').onclick = () => outOfCoinsDialog.close();
}

function updateStoredCoins(updateCoins, totalCoins, currentWin) {
  updateCoins.then(() => {
    const updateData = {coins: totalCoins, currentWin: currentWin};
    fetch('/cards', {
      method: 'PUT',
      body: JSON.stringify(updateData),
      headers: {'Content-Type': 'application/json'}
    }).then(res => {
      if (!res.ok) {
        throw Error(res.status);
      }
    }).then(res => res)
    .catch(err => console.error(err));
  });
}

export {outOfCoinsDialog, updateStoredCoins};