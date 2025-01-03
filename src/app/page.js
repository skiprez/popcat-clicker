'use client';

import { useState, useEffect } from 'react';
import { Button, Tab, Tabs, Box, Typography, Grid, IconButton, TextField, Switch, Snackbar } from '@mui/material';
import { Settings } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

export default function HomePage() {
  const [clicks, setClicks] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [factories, setFactories] = useState(0);
  const [popcatLabs, setPopcatLabs] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [speedUpgrade, setSpeedUpgrade] = useState(0);
  const [luckyClicks, setLuckyClicks] = useState(0);
  const [eventCooldown, setEventCooldown] = useState(5000);
  const [events, setEvents] = useState([]);
  const [settings, setSettings] = useState(false);
  const [clickEffects, setClickEffects] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [mute, setMute] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1); 
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [notification, setNotification] = useState('');
  const baseMultiplierCost = 50;  // Base cost for the first multiplier upgrade
  const multiplierIncrement = 1.5; // The multiplier for the next level (progressively more expensive)
  const baseAutoClickerCost = 100;  // Base cost for the first auto-clicker
  const autoClickerIncrement = 1.6;  // Progressively higher cost
  const baseFactoryCost = 500;  // Base cost for factories
  const factoryIncrement = 1.7;  // Progressively higher cost
  const basePopcatLabCost = 2000;  // Base cost for Popcat Labs
  const popcatLabIncrement = 1.8;  // Progressively higher cost

  const getMultiplierCost = () => Math.floor(baseMultiplierCost * Math.pow(multiplierIncrement, multiplier - 1));
  const getAutoClickerCost = () => Math.floor(baseAutoClickerCost * Math.pow(autoClickerIncrement, autoClickers));
  const getFactoryCost = () => Math.floor(baseFactoryCost * Math.pow(factoryIncrement, factories));
  const getPopcatLabCost = () => Math.floor(basePopcatLabCost * Math.pow(popcatLabIncrement, popcatLabs));

  const handleClick = (e) => {
    setClicks((prev) => prev + multiplier * clickPower);

    const effectId = Date.now();
    const { clientX, clientY } = e;
    setClickEffects((prev) => [...prev, { id: effectId, x: clientX, y: clientY }]);
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== effectId));
    }, 500);

    if (!mute) {
      const popcatSound = new Audio('/pop-sound.mp3');
      popcatSound.play();
    }
  };

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  const buyMultiplier = () => {
    const cost = getMultiplierCost();
    if (clicks >= cost) {
      setClicks((prev) => prev - cost);
      setMultiplier((prev) => prev + 1);
      if (notificationsEnabled) setNotification('Bought Multiplier! Cost: 50 Pops');
    }
  };

  const buyAutoClicker = () => {
    const cost = getAutoClickerCost();
    if (clicks >= cost) {
      setClicks((prev) => prev - cost);
      setAutoClickers((prev) => prev + 1);
      if (notificationsEnabled) setNotification('Bought Auto-Poper! Cost: 100 Pops');
    }
  };

  const buyFactory = () => {
    const cost = getFactoryCost();
    if (clicks >= cost) {
      setClicks((prev) => prev - cost);
      setFactories((prev) => prev + 1);
      if (notificationsEnabled) setNotification('Bought Pop-Factory! Cost: 500 Pops');
    }
  };

  const buyPopcatLab = () => {
    const cost = getPopcatLabCost();
    if (clicks >= cost) {
      setClicks((prev) => prev - cost);
      setPopcatLabs((prev) => prev + 1);
      if (notificationsEnabled) setNotification('Bought Popcat Lab! Cost: 2000 Pops');
    }
  };

  const buyClickPower = () => {
    if (clicks >= 250) {
      setClicks((prev) => prev - 250);
      setClickPower((prev) => prev + 1);
      if (notificationsEnabled) setNotification('Bought Click Power! Cost: 250 Pops');
    }
  };

  const buySpeedUpgrade = () => {
    if (clicks >= 1000) {
      setClicks((prev) => prev - 1000);
      setSpeedUpgrade((prev) => prev + 1);
      if (notificationsEnabled) setNotification('Bought Speed Upgrade! Cost: 1000 Pops');
    }
  };

  const buyLuckyClicks = () => {
    if (clicks >= 1500) {
      setClicks((prev) => prev - 1500);
      setLuckyClicks((prev) => prev + 1);
      if (notificationsEnabled) setNotification('Bought Lucky Clicks! Cost: 1500 Pops');
    }
  };

  const buyEventCooldown = () => {
    if (clicks >= 3000) {
      setClicks((prev) => prev - 3000);
      setEventCooldown((prev) => prev - 1000);
      if (notificationsEnabled) setNotification('Bought Event Cooldown! Cost: 3000 Pops');
    }
  };

  const triggerEvent = (eventName) => {
    if (Date.now() - eventCooldown < 5000) return;
    setEvents((prev) => [...prev, eventName]);
    setTimeout(() => {
      setEvents((prev) => prev.filter((event) => event !== eventName));
    }, 5000);

    if (eventName === 'Double Pops') {
      setMultiplier((prev) => prev * 2);
      setTimeout(() => setMultiplier((prev) => prev / 2), 5000);
    }

    if (eventName === 'Pop Storm') {
      const stormInterval = setInterval(() => setClicks((prev) => prev + 10), 500);
      setTimeout(() => clearInterval(stormInterval), 5000);
    }

    if (notificationsEnabled) setNotification(`Event Triggered: ${eventName}`);
  };

  const toggleSettings = () => setSettings((prev) => !prev);

  const saveStats = () => {
    const stats = {
      clicks,
      multiplier,
      autoClickers,
      factories,
      popcatLabs,
      clickPower,
      speedUpgrade,
      luckyClicks,
      eventCooldown,
      mute,
      gameSpeed,
      notificationsEnabled,
      autoSave,
    };
    localStorage.setItem('popcatStats', JSON.stringify(stats));
    if (notificationsEnabled) setNotification('Settings Saved!');
  };

  const loadStats = () => {
    const savedStats = localStorage.getItem('popcatStats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setClicks(stats.clicks);
      setMultiplier(stats.multiplier);
      setAutoClickers(stats.autoClickers);
      setFactories(stats.factories);
      setPopcatLabs(stats.popcatLabs);
      setClickPower(stats.clickPower);
      setSpeedUpgrade(stats.speedUpgrade);
      setLuckyClicks(stats.luckyClicks);
      setEventCooldown(stats.eventCooldown);
      setMute(stats.mute);
      setGameSpeed(stats.gameSpeed);
      setNotificationsEnabled(stats.notificationsEnabled);
      setAutoSave(stats.autoSave);
      if (notificationsEnabled) setNotification('Settings Loaded!');
    } else {
      if (notificationsEnabled) setNotification('No saved settings found.');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setClicks((prev) => prev + autoClickers + factories * 5 + popcatLabs * 20);
    }, 1000 / gameSpeed); 
    return () => clearInterval(interval);
  }, [autoClickers, factories, popcatLabs, gameSpeed]);

  return (
    <main className="flex flex-row items-center justify-center gap-[300px] min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      <section>
        <h1 className="text-5xl font-extrabold mb-8">Popcat Clicker</h1>

        <div
          className="relative w-60 h-60 cursor-pointer"
          onClick={handleClick}
        >
          <img
            src={clicks % 2 === 0 ? '/popcatopen.jpg' : '/popcatclosed.jpg'}
            alt="Popcat"
            className="w-full h-full rounded-full shadow-lg hover:shadow-2xl transform transition duration-300 ease-in-out"
          />
        </div>
        <Typography variant="h4" className="mt-4 text-white">{clicks} Pops</Typography>
      </section>

      <section>
        <Tabs value={tabIndex} onChange={handleTabChange} centered className="mt-8">
          <Tab label="Upgrades" className="text-white" />
          <Tab label="Stats" className="text-white" />
        </Tabs>

        <Box sx={{ width: '100%' }} className="mt-8">
          {tabIndex === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div className="bg-gray-800 p-8 rounded-xl shadow-xl hover:shadow-2xl">
                <Typography variant="h6" className="text-green-500">Upgrade Multiplier</Typography>
                <Typography variant="body2" className="text-white">Cost: {getMultiplierCost()}</Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={buyMultiplier}
                  disabled={clicks < getMultiplierCost()}
                  className="mt-4 w-full"
                >
                  Buy Multiplier
                </Button>
              </div>

              <div className="bg-gray-800 p-8 rounded-xl shadow-xl hover:shadow-2xl">
                <Typography variant="h6" className="text-yellow-500">Buy Auto-Poper</Typography>
                <Typography variant="body2" className="text-white">Cost: {getAutoClickerCost()}</Typography>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={buyAutoClicker}
                  disabled={clicks < getAutoClickerCost()}
                  className="mt-4 w-full"
                >
                  Buy Auto-Poper
                </Button>
              </div>

              <div className="bg-gray-800 p-8 rounded-xl shadow-xl hover:shadow-2xl">
                <Typography variant="h6" className="text-orange-500">Buy Pop-Factory</Typography>
                <Typography variant="body2" className="text-white">Cost: {getFactoryCost()}</Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={buyFactory}
                  disabled={clicks < getFactoryCost()}
                  className="mt-4 w-full"
                >
                  Buy Pop-Factory
                </Button>
              </div>

              <div className="bg-gray-800 p-8 rounded-xl shadow-xl hover:shadow-2xl">
                <Typography variant="h6" className="text-red-500">Buy Popcat Lab</Typography>
                <Typography variant="body2" className="text-white">Cost: {getPopcatLabCost()}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={buyPopcatLab}
                  disabled={clicks < getPopcatLabCost()}
                  className="mt-4 w-full"
                >
                  Buy Popcat Lab
                </Button>
              </div>
            </div>
          )}

          {tabIndex === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-2xl">
                <Typography variant="h6" className="text-white">Pops</Typography>
                <Typography variant="h4" className="text-green-400">{clicks}</Typography>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-2xl">
                <Typography variant="h6" className="text-white">Multiplier</Typography>
                <Typography variant="h4" className="text-blue-400">x{multiplier}</Typography>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-2xl">
                <Typography variant="h6" className="text-white">Auto-Popers</Typography>
                <Typography variant="h4" className="text-yellow-400">{autoClickers}</Typography>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-2xl">
                <Typography variant="h6" className="text-white">Pop-Factories</Typography>
                <Typography variant="h4" className="text-orange-400">{factories}</Typography>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-2xl">
                <Typography variant="h6" className="text-white">Popcat Labs</Typography>
                <Typography variant="h4" className="text-red-400">{popcatLabs}</Typography>
              </div>
            </div>
          )}
        </Box>

        <div className="mt-6 text-center">
          <IconButton
            onClick={toggleSettings}
            color="primary"
            className="w-12 h-12 p-2 rounded-full shadow-lg bg-gray-800 hover:bg-gray-700"
          >
            <Settings />
          </IconButton>
          {settings && (
            <div className="mt-4 bg-gray-800 p-4 rounded-xl shadow-xl">
              <Typography variant="h6" className="text-white">Settings</Typography>
              <div className="mt-4 flex gap-4">
                <Button onClick={saveStats} variant="contained" color="success">Save Settings</Button>
                <Button onClick={loadStats} variant="contained" color="primary">Load Settings</Button>
              </div>
              <div className="mt-4 flex gap-4 items-center">
                <Typography variant="body1" className="text-white">Mute Click Sound</Typography>
                <Switch
                  checked={mute}
                  onChange={() => setMute((prev) => !prev)}
                  className="text-white"
                />
              </div>
              <div className="mt-4 flex gap-4 items-center">
                <Typography variant="body1" className="text-white">Enable Notifications</Typography>
                <Switch
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled((prev) => !prev)}
                  className="text-white"
                />
              </div>
              <div className="mt-4 flex gap-4 items-center">
                <Typography variant="body1" className="text-white">Auto-Save</Typography>
                <Switch
                  checked={autoSave}
                  onChange={() => setAutoSave((prev) => !prev)}
                  className="text-white"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <Snackbar
        open={notification !== ''}
        autoHideDuration={3000}
        onClose={() => setNotification('')}
        message={notification}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setNotification('')}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#1f2937',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '1rem',
            padding: '10px 20px',
          },
          '& .MuiSnackbarContent-action': {
            color: '#fff',
          },
        }}
      />

    </main>
  );
}
