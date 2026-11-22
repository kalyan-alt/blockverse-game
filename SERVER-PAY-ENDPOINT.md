# Add this to blockverse-server (server.js) so pay gates actually pay the builder

Blockverse now POSTs to `/pay` when a player pays a Studio pay gate:

```json
{ "token": "<player session token>", "to": "<builder name>", "amount": 10, "world": "Castle", "from": "<player name>" }
```

Drop this next to the existing `/buy` and `/profile` handlers. Adjust the two helper
names (`userFromToken`, `findUserByName`, `saveUsers`) to whatever server.js already uses.

```js
app.post('/pay', express.json(), (req, res) => {
  const { token, to, amount } = req.body || {};
  const amt = Math.floor(Number(amount));
  if (!token || !to || !(amt > 0 && amt <= 999)) return res.status(400).json({ ok: false, error: 'bad request' });

  const payer = userFromToken(token);                 // same lookup /profile uses
  if (!payer) return res.status(401).json({ ok: false, error: 'not signed in' });

  const builder = findUserByName(to);                 // case-insensitive name match
  if (!builder) return res.status(404).json({ ok: false, error: 'builder not found' });
  if (builder.name === payer.name) return res.json({ ok: true, note: 'self' });

  // The client already deducted from the payer's profile and will sync it;
  // credit the builder server-side so it survives even if they're offline.
  builder.profile = builder.profile || {};
  builder.profile.bits = (builder.profile.bits || 0) + amt;
  builder.profile.earned = (builder.profile.earned || 0) + amt;   // optional stat
  saveUsers();
  res.json({ ok: true, bits: builder.profile.bits });
});
```

Until this exists, payments still deduct from the player and are queued in their
browser (`bv_pending_payouts`), and nothing reaches the builder. If the builder and
player are the same account, the Blockbux just round-trip.
