'use client';

import { useState, useEffect } from 'react';
import { Button, Tab, Tabs, Box, Card, CardContent, Typography, Grid, IconButton, TextField, Switch } from '@mui/material';
import { Settings } from '@mui/icons-material';

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
  const [gameSpeed, setGameSpeed] = useState(1); // Setting for adjusting game speed
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Setting for notifications
  const [autoSave, setAutoSave] = useState(true); // Setting for automatic saving

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
    if (clicks >= 50) {
      setClicks((prev) => prev - 50);
      setMultiplier((prev) => prev + 1);
    }
  };

  const buyAutoClicker = () => {
    if (clicks >= 100) {
      setClicks((prev) => prev - 100);
      setAutoClickers((prev) => prev + 1);
    }
  };

  const buyFactory = () => {
    if (clicks >= 500) {
      setClicks((prev) => prev - 500);
      setFactories((prev) => prev + 1);
    }
  };

  const buyPopcatLab = () => {
    if (clicks >= 2000) {
      setClicks((prev) => prev - 2000);
      setPopcatLabs((prev) => prev + 1);
    }
  };

  const buyClickPower = () => {
    if (clicks >= 250) {
      setClicks((prev) => prev - 250);
      setClickPower((prev) => prev + 1);
    }
  };

  const buySpeedUpgrade = () => {
    if (clicks >= 1000) {
      setClicks((prev) => prev - 1000);
      setSpeedUpgrade((prev) => prev + 1);
    }
  };

  const buyLuckyClicks = () => {
    if (clicks >= 1500) {
      setClicks((prev) => prev - 1500);
      setLuckyClicks((prev) => prev + 1);
    }
  };

  const buyEventCooldown = () => {
    if (clicks >= 3000) {
      setClicks((prev) => prev - 3000);
      setEventCooldown((prev) => prev - 1000);
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
    alert('Settings saved!');
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
      alert('Settings loaded!');
    } else {
      alert('No saved settings found.');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setClicks((prev) => prev + autoClickers + factories * 5 + popcatLabs * 20);
    }, 1000 / gameSpeed); // Adjust game speed based on the setting
    return () => clearInterval(interval);
  }, [autoClickers, factories, popcatLabs, gameSpeed]);

  return (
    <main className="flex flex-row items-center justify-center gap-[300px] min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      <section>
        <h1 className="text-5xl font-extrabold mb-8">Popcat Clicker</h1>

        {/* Popcat Image Area */}
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
        {/* Display Clicks under the image */}
        <Typography variant="h4" className="mt-4 text-white">{clicks} Pops</Typography>
      </section>

      <section>
        {/* Tabs for Upgrades and Stats */}
        <Tabs value={tabIndex} onChange={handleTabChange} centered className="mt-8">
          <Tab label="Upgrades" className="text-white" />
          <Tab label="Stats" className="text-white" />
        </Tabs>

        <Box sx={{ width: '100%' }} className="mt-8">
          {tabIndex === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Card className="bg-gray-800 p-4 rounded-xl shadow-xl hover:shadow-2xl">
                <CardContent>
                  <Typography variant="h6" className="text-green-500">Upgrade Multiplier</Typography>
                  <Typography variant="body2" color="textSecondary" className="text-white">Cost: 50 Pops</Typography>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={buyMultiplier}
                    disabled={clicks < 50}
                    className="mt-4 w-full"
                  >
                    Buy Multiplier
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 p-4 rounded-xl shadow-xl hover:shadow-2xl">
                <CardContent>
                  <Typography variant="h6" className="text-yellow-500">Buy Auto-Poper</Typography>
                  <Typography variant="body2" color="textSecondary" className="text-white">Cost: 100 Pops</Typography>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={buyAutoClicker}
                    disabled={clicks < 100}
                    className="mt-4 w-full"
                  >
                    Buy Auto-Poper
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 p-4 rounded-xl shadow-xl hover:shadow-2xl">
                <CardContent>
                  <Typography variant="h6" className="text-orange-500">Buy Pop-Factory</Typography>
                  <Typography variant="body2" color="textSecondary" className="text-white">Cost: 500 Pops</Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={buyFactory}
                    disabled={clicks < 500}
                    className="mt-4 w-full"
                  >
                    Buy Pop-Factory
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 p-4 rounded-xl shadow-xl hover:shadow-2xl">
                <CardContent>
                  <Typography variant="h6" className="text-red-500">Buy Popcat Lab</Typography>
                  <Typography variant="body2" color="textSecondary" className="text-white">Cost: 2000 Pops</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={buyPopcatLab}
                    disabled={clicks < 2000}
                    className="mt-4 w-full"
                  >
                    Buy Popcat Lab
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {tabIndex === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              {/* Stats Section */}
              <Card className="bg-gray-800 p-4 rounded-xl shadow-xl hover:shadow-2xl">
                <CardContent>
                  <Typography variant="h6" className="text-white">Pops</Typography>
                  <Typography variant="h4" className="text-green-400">{clicks}</Typography>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 p-4 rounded-xl shadow-xl hover:shadow-2xl">
                <CardContent>
                  <Typography variant="h6" className="text-white">Multiplier</Typography>
                  <Typography variant="h4" className="text-blue-400">x{multiplier}</Typography>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 p-4 rounded-xl shadow-xl hover:shadow-2xl">
                <CardContent>
                  <Typography variant="h6" className="text-white">Auto-Popers</Typography>
                  <Typography variant="h4" className="text-yellow-400">{autoClickers}</Typography>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 p-4 rounded-xl shadow-xl hover:shadow-2xl">
                <CardContent>
                  <Typography variant="h6" className="text-white">Pop-Factories</Typography>
                  <Typography variant="h4" className="text-orange-400">{factories}</Typography>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 p-4 rounded-xl shadow-xl hover:shadow-2xl">
                <CardContent>
                  <Typography variant="h6" className="text-white">Popcat Labs</Typography>
                  <Typography variant="h4" className="text-red-400">{popcatLabs}</Typography>
                </CardContent>
              </Card>
            </div>
          )}
        </Box>

        {/* Settings Toggle */}
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
                  color="primary"
                />
              </div>
              <div className="mt-4 flex gap-4 items-center">
                <Typography variant="body1" className="text-white">Game Speed</Typography>
                <TextField
                  type="number"
                  value={gameSpeed}
                  onChange={(e) => setGameSpeed(Math.max(1, parseFloat(e.target.value)))}
                  className="w-20"
                />
              </div>
              <div className="mt-4 flex gap-4 items-center">
                <Typography variant="body1" className="text-white">Enable Notifications</Typography>
                <Switch
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled((prev) => !prev)}
                  color="primary"
                />
              </div>
              <div className="mt-4 flex gap-4 items-center">
                <Typography variant="body1" className="text-white">Enable Auto Save</Typography>
                <Switch
                  checked={autoSave}
                  onChange={() => setAutoSave((prev) => !prev)}
                  color="primary"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
